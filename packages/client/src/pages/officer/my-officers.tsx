import * as React from "react";
import { useTranslations } from "use-intl";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Button } from "components/Button";
import { Layout } from "components/Layout";
import { useModal } from "context/ModalContext";
import { getSessionUser } from "lib/auth";
import { getTranslations } from "lib/getTranslation";
import { GetServerSideProps } from "next";
import { ModalIds } from "types/ModalIds";
import { DepartmentValue, DivisionValue, Officer, Value } from "types/prisma";
import useFetch from "lib/useFetch";
import { FullOfficer } from "state/dispatchState";
import { makeImageUrl, requestAll } from "lib/utils";
import { useGenerateCallsign } from "hooks/useGenerateCallsign";

const AlertModal = dynamic(async () => (await import("components/modal/AlertModal")).AlertModal);
const ManageOfficerModal = dynamic(
  async () => (await import("components/leo/modals/ManageOfficerModal")).ManageOfficerModal,
);

export type OfficerWithDept = Officer & {
  division: DivisionValue;
  department: DepartmentValue;
  rank: Value<"OFFICER_RANK">;
};

interface Props {
  officers: FullOfficer[];
}

export default function MyOfficers({ officers: data }: Props) {
  const common = useTranslations("Common");
  const t = useTranslations("Leo");
  const { openModal, closeModal } = useModal();
  const { state, execute } = useFetch();
  const generateCallsign = useGenerateCallsign();

  const [officers, setOfficers] = React.useState(data ?? []);
  const [tempOfficer, setTempOfficer] = React.useState<FullOfficer | null>(null);

  async function handleDeleteOfficer() {
    if (!tempOfficer) return;

    const { json } = await execute(`/leo/${tempOfficer.id}`, { method: "DELETE" });

    if (json) {
      closeModal(ModalIds.AlertDeleteOfficer);
      setOfficers((p) => p.filter((v) => v.id !== tempOfficer.id));
    }
  }

  function handleEditClick(officer: FullOfficer) {
    setTempOfficer(officer);
    openModal(ModalIds.ManageOfficer);
  }

  function handleDeleteClick(officer: FullOfficer) {
    setTempOfficer(officer);
    openModal(ModalIds.AlertDeleteOfficer);
  }

  return (
    <Layout>
      <Head>
        <title>{t("myOfficers")} - SnailyCAD</title>
      </Head>

      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("myOfficers")}</h1>

        <Button onClick={() => openModal(ModalIds.ManageOfficer)}>{t("createOfficer")}</Button>
      </header>

      {officers.length <= 0 ? (
        <p className="mt-5">{t("noOfficers")}</p>
      ) : (
        <div className="overflow-x-auto w-full mt-3">
          <table className="overflow-hidden w-full whitespace-nowrap max-h-64">
            <thead>
              <tr>
                <th>{t("officer")}</th>
                <th>{t("callsign")}</th>
                <th>{t("badgeNumber")}</th>
                <th>{t("department")}</th>
                <th>{t("division")}</th>
                <th>{t("citizen")}</th>
                <th>{common("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {officers.map((officer) => (
                <tr key={officer.id}>
                  <td className="capitalize flex items-center">
                    {officer.imageId ? (
                      <img
                        className="rounded-md w-[30px] h-[30px] object-cover mr-2"
                        draggable={false}
                        src={makeImageUrl("units", officer.imageId)}
                      />
                    ) : null}
                    {officer.name}
                  </td>
                  <td>{generateCallsign(officer)}</td>
                  <td>{String(officer.badgeNumber)}</td>
                  <td>{officer.department.value?.value}</td>
                  <td>{officer.division?.value?.value}</td>
                  <td>
                    {officer.citizen ? (
                      <span className="capitalize">
                        {officer.citizen.name} {officer.citizen.surname}
                      </span>
                    ) : (
                      common("none")
                    )}
                  </td>
                  <td className="w-36">
                    <Button small onClick={() => handleEditClick(officer)} variant="success">
                      {common("edit")}
                    </Button>
                    <Button
                      onClick={() => handleDeleteClick(officer)}
                      className="ml-2"
                      variant="danger"
                      small
                    >
                      {common("delete")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ManageOfficerModal
        onCreate={(officer) => setOfficers((p) => [officer, ...p])}
        onUpdate={(old, newO) => {
          setOfficers((p) => {
            const idx = p.indexOf(old);
            p[idx] = newO;

            return p;
          });
        }}
        officer={tempOfficer}
        onClose={() => setTempOfficer(null)}
      />

      <AlertModal
        title={t("deleteOfficer")}
        description={t.rich("alert_deleteOfficer", {
          span: (children) => <span className="font-semibold">{children}</span>,
          officer: tempOfficer && tempOfficer.name,
        })}
        id={ModalIds.AlertDeleteOfficer}
        onDeleteClick={handleDeleteOfficer}
        state={state}
        onClose={() => setTempOfficer(null)}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, locale }) => {
  const [citizens, { officers }, values] = await requestAll(req, [
    ["/citizen", []],
    ["/leo", { officers: [] }],
    ["/admin/values/department?paths=division", []],
  ]);

  return {
    props: {
      session: await getSessionUser(req.headers),
      officers,
      citizens,
      values,
      messages: {
        ...(await getTranslations(["leo", "common"], locale)),
      },
    },
  };
};
