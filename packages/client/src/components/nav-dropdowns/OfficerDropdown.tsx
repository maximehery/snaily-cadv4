import * as React from "react";
import { Menu, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { ChevronDown } from "react-bootstrap-icons";
import Link from "next/link";
import { useAuth } from "context/AuthContext";

export const OfficerDropdown = () => {
  const router = useRouter();
  const isActive = (route: string) => router.pathname.startsWith(route);
  const { user } = useAuth();

  const items = ["My Officers", "My Officer Logs"];

  return (
    <>
      <Menu as="div" className="relative inline-block text-left z-50">
        <Menu.Button
          className={`flex items-center py-3 px-2 text-gray-700 transition duration-300 ${
            isActive("/officer") && "font-semibold"
          }`}
        >
          Officer
          <span className="ml-1 mt-1">
            <ChevronDown width={15} height={15} className="text-gray-700" />
          </span>
        </Menu.Button>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 w-36 mt-0 origin-top-left bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item>
                {({ active }) => (
                  <Link href="/officer">
                    <a
                      className={`${
                        active ? "bg-gray-200" : "text-gray-900"
                      } block hover:bg-gray-200 group rounded-md items-center w-full px-3 py-1.5 text-sm transition-all`}
                    >
                      Dashboard
                    </a>
                  </Link>
                )}
              </Menu.Item>

              {items.map((item) => {
                const path = item.replace(/ +/g, "-").toLowerCase();

                return (
                  <Menu.Item key={item}>
                    {({ active }) => (
                      <Link href={`/officer/${path}`}>
                        <a
                          className={`${
                            active ? "bg-gray-200" : "text-gray-900"
                          } block hover:bg-gray-200 group rounded-md items-center w-full px-3 py-1.5 text-sm transition-all`}
                        >
                          {item}
                        </a>
                      </Link>
                    )}
                  </Menu.Item>
                );
              })}

              {user?.isSupervisor ? (
                <Menu.Item>
                  {({ active }) => (
                    <Link href="/admin/manage/units">
                      <a
                        className={`${
                          active ? "bg-gray-200" : "text-gray-900"
                        } block hover:bg-gray-200 group rounded-md items-center w-full px-3 py-1.5 text-sm transition-all`}
                      >
                        Manage Units
                      </a>
                    </Link>
                  )}
                </Menu.Item>
              ) : null}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};
