import { Container, Divider } from "@mui/material";
import PageBar from "@/components/PageBar";
import { ReactNode } from "react";
import { ChatBot } from "@/components/chatbot/ChatBot";

interface PageContainerProps {
  children: ReactNode;
  title: string;
}

export const PatientContextPageContainer = ({
  children,
  title,
}: PageContainerProps) => {
  return (
    <>
      <PageBar title={title} />
      <Divider />
      <Container maxWidth="lg" sx={{ pt: 3, pb: { xs: 3, md: 0 } }}>
        {children}
      </Container>
      <ChatBot />
    </>
  );
};
