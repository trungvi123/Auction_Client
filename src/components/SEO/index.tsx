import React from "react";
import { Helmet } from "react-helmet-async";
interface IProps {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  url?: string;
}

const SEO = ({ title, type, image, url, description }: IProps) => {
  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {/* End standard metadata tags */}
      {/* Facebook tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      {/* End Facebook tags */}
    </Helmet>
  );
};

export default React.memo(SEO);
