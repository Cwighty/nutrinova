import { Container, Divider } from "@mui/material";
import PageBar from "@/components/PageBar";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  title: string;
}

export const PageContainer = ({ children, title }: PageContainerProps) => {
  return (
    <>
      <PageBar title={title} />
      <Divider />
      <Container maxWidth={false} sx={{ pt: 3, pb: { xs: 3, md: 0 } }}>
        {children}
      </Container>
    </>
  );
};
