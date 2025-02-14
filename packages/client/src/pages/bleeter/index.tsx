import { useTranslations } from "use-intl";
import Head from "next/head";
import Link from "next/link";

import { Layout } from "components/Layout";
import { getSessionUser } from "lib/auth";
import { getTranslations } from "lib/getTranslation";
import { GetServerSideProps } from "next";
import { BleeterPost, User } from "types/prisma";
import { handleRequest } from "lib/fetch";
import { Button } from "components/Button";
import { useModal } from "context/ModalContext";
import { ModalIds } from "types/ModalIds";
import dynamic from "next/dynamic";

const ManageBleetModal = dynamic(
  async () => (await import("components/bleeter/ManageBleetModal")).ManageBleetModal,
);

interface Props {
  posts: (BleeterPost & { user: Pick<User, "username"> })[];
}

export default function Bleeter({ posts }: Props) {
  const t = useTranslations("Bleeter");
  const { openModal } = useModal();

  return (
    <Layout>
      <Head>
        <title>{t("bleeter")} - SnailyCAD</title>
      </Head>

      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">{t("bleeter")}</h1>

        <Button onClick={() => openModal(ModalIds.ManageBleetModal)}>{t("createBleet")}</Button>
      </header>

      {posts.length <= 0 ? (
        <p className="mt-2">{t("noPosts")}</p>
      ) : (
        <ul className="mt-5 space-y-3">
          {posts.map((post) => (
            <li
              className="flex items-start justify-between bg-gray-200/80 p-4 rounded-md"
              key={post.id}
            >
              <div>
                <h1 className="text-2xl font-semibold">{post.title}</h1>
                <h3>{post.user?.username}</h3>
              </div>

              <div>
                <Link href={`/bleeter/${post.id}`}>
                  <a>
                    <Button className="bg-gray-500/80">{t("viewBleet")}</Button>
                  </a>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ManageBleetModal post={null} />
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale, req }) => {
  const { data } = await handleRequest("/bleeter", {
    headers: req.headers,
  }).catch(() => ({ data: [] }));

  return {
    props: {
      posts: data,
      session: await getSessionUser(req.headers),
      messages: {
        ...(await getTranslations(["bleeter", "common"], locale)),
      },
    },
  };
};
