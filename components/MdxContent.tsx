import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { MDXComponents } from "mdx/types";
import { headingToId } from "@/lib/utils";
import { LessonFigure } from "./LessonFigure";
import type { LessonImage } from "@/lib/lesson-images";

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
  img: (props) => (
    <LessonFigure src={String(props.src ?? "")} caption={String(props.alt ?? "")} />
  ),
};

function splitSections(source: string): { heading: string | null; markdown: string }[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const sections: { heading: string | null; markdown: string[] }[] = [];
  let current: { heading: string | null; markdown: string[] } = {
    heading: null,
    markdown: [],
  };

  const push = () => {
    if (current.heading !== null || current.markdown.some((l) => l.trim())) {
      sections.push(current);
    }
  };

  for (const line of lines) {
    if (line.startsWith("## ")) {
      push();
      current = { heading: line.slice(3).trim(), markdown: [line] };
    } else {
      current.markdown.push(line);
    }
  }
  push();
  return sections.map((s) => ({ heading: s.heading, markdown: s.markdown.join("\n") }));
}

export function MdxContent({
  source,
  images = [],
}: {
  source: string;
  images?: LessonImage[];
}) {
  if (!images.length) {
    return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />;
  }

  const sections = splitSections(source);
  return (
    <>
      {sections.map((section, i) => (
        <div key={`${section.heading ?? "lead"}-${i}`}>
          <MDXRemote source={section.markdown} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          {images
            .filter((img) => img.after && img.after === section.heading)
            .map((img) => (
              <LessonFigure
                key={img.src}
                src={img.src}
                caption={img.caption}
                credit={img.credit}
                href={img.href}
                license={img.license}
                licenseHref={img.licenseHref}
              />
            ))}
        </div>
      ))}
    </>
  );
}
