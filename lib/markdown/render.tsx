import type { ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import { cn, slugify } from "@/lib/utils";

function childrenToText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children.map(childrenToText).join("");
  }

  return "";
}

function createHeadingIdFactory() {
  const usedIds = new Map<string, number>();

  return (children: ReactNode) => {
    const baseId = slugify(childrenToText(children)) || "section";
    const currentCount = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, currentCount + 1);

    return currentCount === 0 ? baseId : `${baseId}-${currentCount + 1}`;
  };
}

export function MarkdownRenderer({ content, className }: { content: string; className?: string }) {
  const getHeadingId = createHeadingIdFactory();

  const components: Components = {
    h1({ children }) {
      return (
        <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight first:mt-0">
          {children}
        </h1>
      );
    },
    h2({ children }) {
      const id = getHeadingId(children);

      return (
        <h2
          id={id}
          className="scroll-mt-28 border-b border-border/70 pb-2 pt-8 font-display text-3xl font-semibold tracking-tight"
        >
          {children}
        </h2>
      );
    },
    h3({ children }) {
      const id = getHeadingId(children);

      return (
        <h3 id={id} className="scroll-mt-28 pt-6 text-xl font-semibold tracking-tight">
          {children}
        </h3>
      );
    },
    p({ children }) {
      return <p className="leading-8 text-foreground/90">{children}</p>;
    },
    a({ children, href }) {
      return (
        <a
          href={href}
          className="font-medium text-accent underline underline-offset-4"
          rel={href?.startsWith("http") ? "noreferrer" : undefined}
          target={href?.startsWith("http") ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
    blockquote({ children }) {
      return (
        <blockquote className="rounded-2xl border-l-4 border-accent bg-muted/40 px-5 py-4 italic text-muted-foreground">
          {children}
        </blockquote>
      );
    },
    ul({ children }) {
      return <ul className="ml-6 list-disc space-y-2 leading-8">{children}</ul>;
    },
    ol({ children }) {
      return <ol className="ml-6 list-decimal space-y-2 leading-8">{children}</ol>;
    },
    li({ children }) {
      return <li className="pl-1">{children}</li>;
    },
    hr() {
      return <hr className="my-8 border-border/80" />;
    },
    table({ children }) {
      return (
        <div className="my-6 overflow-x-auto rounded-2xl border border-border/70">
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="border-b border-border/70 bg-muted/55 px-4 py-3 text-left font-medium">
          {children}
        </th>
      );
    },
    td({ children }) {
      return <td className="border-b border-border/50 px-4 py-3 align-top">{children}</td>;
    },
    pre({ children }) {
      return (
        <pre className="overflow-x-auto rounded-2xl border border-border/70 bg-primary/95 p-4 text-primary-foreground shadow-sm">
          {children}
        </pre>
      );
    },
    code({ children, className }) {
      return (
        <code
          className={cn(
            "rounded-md bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground",
            className?.startsWith("language-") &&
              "bg-transparent p-0 text-primary-foreground",
            className,
          )}
        >
          {children}
        </code>
      );
    },
    input(props) {
      return <input {...props} className="mr-2 align-middle" disabled />;
    },
  };

  return (
    <article className={cn("space-y-5 text-base", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
