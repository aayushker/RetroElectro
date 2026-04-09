import Container from "./Container";
import Surface from "./Surface";

function PageShell({ className = "", children }) {
  return (
    <Container className="pb-10">
      <Surface
        className={[
          "rounded-re-xl px-5 py-7 sm:px-8 sm:py-10",
          "re-fade-up",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </Surface>
    </Container>
  );
}

export default PageShell;

