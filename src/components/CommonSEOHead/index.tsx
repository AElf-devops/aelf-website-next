import Head from "next/head";
import { PAGE_KEY, PAGE_METADATA } from "@/constants";
import getUrlConfig from "@/constants/network/cms";

const urlConfig = getUrlConfig();

interface ICommonSEOHeadProps {
  pageKey: PAGE_KEY;
}

export default function CommonSEOHead({ pageKey }: ICommonSEOHeadProps) {
  const { TITLE, DESCRIPTION, PATH } =
    PAGE_METADATA[pageKey] || PAGE_KEY.LANDING;

  const url = `${urlConfig.aelf}${PATH}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "aelf",
    alternateName: "aelf",
    description: DESCRIPTION,
    url,
  };

  return (
    <>
      <Head>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
      </Head>
      <script
        id="webpage-structured-data-script"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </>
  );
}
