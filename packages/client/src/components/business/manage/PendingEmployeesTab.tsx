import * as React from "react";
import { Tab } from "@headlessui/react";
import { useTranslations } from "use-intl";
import { Button } from "components/Button";
import { FullEmployee, useBusinessState } from "state/businessState";
import { EmployeeAsEnum, whitelistStatus } from "types/prisma";
import useFetch from "lib/useFetch";

export const PendingEmployeesTab = () => {
  const { state, execute } = useFetch();
  const common = useTranslations("Common");
  const t = useTranslations("Business");

  const { currentBusiness, currentEmployee, setCurrentBusiness } = useBusinessState();

  const employees =
    currentBusiness?.employees.filter((v) => v.whitelistStatus === whitelistStatus.PENDING) ?? [];

  async function handleUpdate(employee: FullEmployee, type: "accept" | "decline") {
    if (!currentBusiness || !currentEmployee) return;

    const { json } = await execute(
      `/businesses/employees/${currentBusiness.id}/${employee.id}/${type}`,
      {
        method: "PUT",
        data: { employeeId: currentEmployee.id },
      },
    );

    if (json.id) {
      setCurrentBusiness({
        ...currentBusiness,
        employees: currentBusiness.employees.map((em) => {
          if (em.id === employee.id) {
            return { ...employee, ...json };
          }

          return em;
        }),
      });
    }
  }

  return (
    <Tab.Panel className="mt-3">
      <h3 className="text-2xl font-semibold">{t("pendingEmployees")}</h3>

      <ul className="space-y-3 mt-3">
        {employees.length <= 0 ? (
          <p>{t("noPendingEmployees")}</p>
        ) : (
          employees.map((employee) => (
            <li
              className="bg-gray-200/60 rounded-md p-4 flex items-baseline justify-between"
              key={employee.id}
            >
              <div>
                <span className="font-semibold text-xl">
                  {employee.citizen.surname} {employee.citizen.name}
                </span>
              </div>

              {employee.role.as !== EmployeeAsEnum.OWNER ? (
                <div>
                  <Button
                    disabled={state === "loading"}
                    onClick={() => handleUpdate(employee, "accept")}
                    variant="success"
                  >
                    {common("accept")}
                  </Button>
                  <Button
                    disabled={state === "loading"}
                    onClick={() => handleUpdate(employee, "decline")}
                    className="ml-2"
                    variant="danger"
                  >
                    {common("decline")}
                  </Button>
                </div>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </Tab.Panel>
  );
};
