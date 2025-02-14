import * as React from "react";
import { Star } from "react-bootstrap-icons";
import Link from "next/link";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import { Button } from "components/Button";
import { Layout } from "components/Layout";
import { getSessionUser } from "lib/auth";
import { getTranslations } from "lib/getTranslation";
import { useModal } from "context/ModalContext";
import { ModalIds } from "types/ModalIds";
import { FullBusiness, FullEmployee, useBusinessState } from "state/businessState";
import { useTranslations } from "use-intl";
import Head from "next/head";
import { BusinessPost, whitelistStatus } from "types/prisma";
import useFetch from "lib/useFetch";
import dynamic from "next/dynamic";
import { requestAll } from "lib/utils";

interface Props {
  employee: FullEmployee | null;
  business: FullBusiness | null;
}

const AlertModal = dynamic(async () => (await import("components/modal/AlertModal")).AlertModal);
const ManageBusinessPostModal = dynamic(
  async () => (await import("components/business/ManagePostModal")).ManageBusinessPostModal,
);

export default function BusinessId(props: Props) {
  const { state: fetchState, execute } = useFetch();
  const { openModal, closeModal } = useModal();
  const { currentBusiness, currentEmployee, posts, ...state } = useBusinessState();
  const common = useTranslations("Common");
  const t = useTranslations("Business");

  const [tempPost, setTempPost] = React.useState<BusinessPost | null>(null);

  async function handlePostDeletion() {
    if (!tempPost) return;

    const { json } = await execute(`/businesses/${currentBusiness?.id}/posts/${tempPost.id}`, {
      method: "DELETE",
      data: { employeeId: currentEmployee?.id },
    });

    if (json) {
      state.setPosts(posts.filter((p) => p.id !== tempPost.id));
      setTempPost(null);
      closeModal(ModalIds.AlertDeleteBusinessPost);
    }
  }

  function handleEdit(post: BusinessPost) {
    openModal(ModalIds.ManageBusinessPost);
    setTempPost(post);
  }

  function handleDelete(post: BusinessPost) {
    openModal(ModalIds.AlertDeleteBusinessPost);
    setTempPost(post);
  }

  React.useEffect(() => {
    state.setCurrentBusiness(props.business);
    state.setCurrentEmployee(props.employee);
    state.setPosts(props.business?.businessPosts ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, state.setCurrentEmployee, state.setCurrentBusiness, state.setPosts]);

  const owner = currentBusiness?.employees.find((v) => v.citizenId === currentBusiness.citizenId);

  if (!currentBusiness || !currentEmployee) {
    return null;
  }

  if (currentEmployee.whitelistStatus === whitelistStatus.PENDING) {
    return (
      <Layout>
        <p>{t("businessIsWhitelisted")}</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{currentBusiness.name}</title>
      </Head>

      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{currentBusiness.name}</h1>

        <div>
          {currentEmployee.canCreatePosts ? (
            <Button onClick={() => openModal(ModalIds.ManageBusinessPost)} className="mr-2">
              {t("createPost")}
            </Button>
          ) : null}
          {owner?.citizenId === currentEmployee.citizenId ? (
            <Link href={`/business/${currentBusiness.id}/${currentEmployee.id}/manage`}>
              <a>
                <Button>{common("manage")}</Button>
              </a>
            </Link>
          ) : null}
        </div>
      </header>

      <main className="flex flex-col sm:flex-row mt-5">
        <section className="w-full mr-5">
          <ul className="space-y-3">
            {posts.map((post) => {
              const publishedBy = currentBusiness.employees.find((em) => em.id === post.employeeId);

              return (
                <li className="bg-gray-100 overflow-hidden rounded-md" key={post.id}>
                  <header className="p-4 flex items-center justify-between">
                    <h3 className="text-2xl font-semibold">{post.title}</h3>

                    {post.employeeId === currentEmployee.id ? (
                      <div>
                        <Button onClick={() => handleEdit(post)} small variant="success">
                          {common("edit")}
                        </Button>
                        <Button
                          onClick={() => handleDelete(post)}
                          className="ml-2"
                          small
                          variant="danger"
                        >
                          {common("delete")}
                        </Button>
                      </div>
                    ) : null}
                  </header>

                  <main className="p-4 pt-0">
                    <ReactMarkdown>{post.body}</ReactMarkdown>
                  </main>

                  {publishedBy ? (
                    <footer className="bg-gray-200/30 px-4 py-2">
                      <span className="font-semibold">{t("publishedBy")}: </span>
                      <span>
                        {publishedBy?.citizen.name} {publishedBy?.citizen.surname}
                      </span>
                    </footer>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>

        <aside className="w-[20rem]">
          <h3 className="text-xl font-semibold">{t("employees")}</h3>

          <ul className="flex flex-col space-y-2">
            {currentBusiness.employees
              .filter((v) => v.whitelistStatus !== whitelistStatus.PENDING)
              .sort((a, b) => Number(b.employeeOfTheMonth) - Number(a.employeeOfTheMonth))
              .map((employee) => (
                <li className="flex items-center" key={employee.id}>
                  {employee.employeeOfTheMonth ? (
                    <span title={t("employeeOfTheMonth")} className="mr-2">
                      <Star className="text-yellow-500" />
                    </span>
                  ) : null}

                  <span className="capitalize">
                    {employee.citizen.name} {employee.citizen.surname}
                  </span>
                </li>
              ))}
          </ul>
        </aside>
      </main>

      {currentEmployee.canCreatePosts ? (
        <ManageBusinessPostModal
          post={tempPost}
          onUpdate={() => void 0}
          onCreate={(post) => state.setPosts([post, ...posts])}
          onClose={() => setTimeout(() => setTempPost(null), 100)}
        />
      ) : null}

      <AlertModal
        title={t("deletePost")}
        description={t("alert_deletePost")}
        id={ModalIds.AlertDeleteBusinessPost}
        onDeleteClick={handlePostDeletion}
        state={fetchState}
        onClose={() => setTempPost(null)}
      />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale, req }) => {
  const [business] = await requestAll(req, [
    [`/businesses/business/${query.id}?employeeId=${query.employeeId}`, null],
  ]);

  return {
    notFound: !business || !business?.employee,
    props: {
      business,
      employee: business?.employee ?? null,
      session: await getSessionUser(req.headers),
      messages: {
        ...(await getTranslations(["business", "common"], locale)),
      },
    },
  };
};
