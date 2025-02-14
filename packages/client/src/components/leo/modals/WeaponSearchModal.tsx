import * as React from "react";
import { Button } from "components/Button";
import { Error } from "components/form/Error";
import { FormField } from "components/form/FormField";
import { Loader } from "components/Loader";
import { Modal } from "components/modal/Modal";
import { useModal } from "context/ModalContext";
import { Form, Formik } from "formik";
import useFetch from "lib/useFetch";
import { ModalIds } from "types/ModalIds";
import { useTranslations } from "use-intl";
import { Input } from "components/form/Input";
import { Citizen, Value, Weapon } from "types/prisma";

export const WeaponSearchModal = () => {
  const { isOpen, closeModal } = useModal();
  const common = useTranslations("Common");
  const wT = useTranslations("Weapons");
  const t = useTranslations("Leo");
  const { state, execute } = useFetch();

  const [results, setResults] = React.useState<WeaponSearchResult | null | boolean>(null);

  React.useEffect(() => {
    if (!isOpen(ModalIds.WeaponSearch)) {
      setResults(null);
    }
  }, [isOpen]);

  async function onSubmit(values: typeof INITIAL_VALUES) {
    const { json } = await execute("/search/weapon", {
      method: "POST",
      data: values,
      noToast: true,
    });

    if (json.id) {
      setResults(json);
    } else {
      setResults(false);
    }
  }

  const INITIAL_VALUES = {
    serialNumber: "",
  };

  return (
    <Modal
      title={t("weaponSearch")}
      onClose={() => closeModal(ModalIds.WeaponSearch)}
      isOpen={isOpen(ModalIds.WeaponSearch)}
      className="min-w-[750px]"
    >
      <Formik initialValues={INITIAL_VALUES} onSubmit={onSubmit}>
        {({ handleChange, errors, values, isValid }) => (
          <Form>
            <FormField label={t("serialNumber")} fieldId="serialNumber">
              <Input
                value={values.serialNumber}
                hasError={!!errors.serialNumber}
                id="serialNumber"
                onChange={handleChange}
              />
              <Error>{errors.serialNumber}</Error>
            </FormField>

            {typeof results === "boolean" && results !== null ? <p>{t("weaponNotFound")}</p> : null}

            {typeof results !== "boolean" && results ? (
              <div className="mt-3">
                <h3 className="text-2xl font-semibold">{t("results")}</h3>

                <ul className="mt-2">
                  <li>
                    <span className="font-semibold">{wT("model")}: </span>
                    {results.model.value}
                  </li>
                  <li>
                    <span className="font-semibold">{wT("registrationStatus")}: </span>
                    {results.registrationStatus.value}
                  </li>
                  <li>
                    <span className="font-semibold">{wT("serialNumber")}: </span>
                    {results.serialNumber}
                  </li>
                  <li>
                    <span className="font-semibold">{t("owner")}: </span>
                    <span className="capitalize">
                      {results.citizen.name} {results.citizen.surname}
                    </span>
                  </li>
                </ul>
              </div>
            ) : null}

            <footer className="mt-5 flex justify-end">
              <Button
                type="reset"
                onClick={() => closeModal(ModalIds.WeaponSearch)}
                variant="cancel"
              >
                {common("cancel")}
              </Button>
              <Button
                className="flex items-center"
                disabled={!isValid || state === "loading"}
                type="submit"
              >
                {state === "loading" ? <Loader className="mr-2" /> : null}
                {common("search")}
              </Button>
            </footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

interface WeaponSearchResult extends Weapon {
  citizen: Citizen;
  model: Value<"WEAPON">;
  registrationStatus: Value<"LICENSE">;
}
