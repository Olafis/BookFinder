type AmazonLinkInput = {
  isbn?: string;
  title: string;
};

export function getAmazonAssociateTag(): string | undefined {
  const tag = process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG?.trim();
  return tag || undefined;
}

export function getAmazonUrl({ isbn, title }: AmazonLinkInput): string {
  const url = new URL("https://www.amazon.com/s");
  url.searchParams.set("k", isbn || title);
  url.searchParams.set("i", "stripbooks");
  const tag = getAmazonAssociateTag();
  if (tag) {
    url.searchParams.set("tag", tag);
  }
  return url.toString();
}
