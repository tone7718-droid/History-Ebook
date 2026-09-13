import { MDXRemote } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import { headingToId } from "@/lib/utils";

const components: MDXComponents = {
  h2: ({ children, ...props }) => {
    const text = String(children);
    const id = headingToId(text);
    return (
      <h2 id={id} className="scroll-mt-28" {...props}>
        {children}
      </h2>
    );
  },
  table: (props) => (
    <div className="my-4 overflow-x-auto">
      <table {...props} />
    </div>
  ),
};

export function MdxContent({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} />;
}
