import { Body, Button, Container, Head, Heading, Html, Img, Link, Section, Text } from "@react-email/components";
import * as React from "react";

export const Confirmation: React.FC<Readonly<{}>> = () => (
  <Html>
    <Head />
    <Body
      style={{
        backgroundColor: "#fff",
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}
    >
      <Section style={{ marginTop: 16, marginBottom: 16 }}>
        <Img
          alt="Dawbell"
          height="150"
          src="https://www.cre8ingvision.com/wp-content/uploads/2020/11/Transparent.png"
          style={{
            width: "100%",
            borderRadius: 12,
            objectFit: "cover",
          }}
        />
        <Section
          style={{
            marginTop: 32,
            textAlign: "center",
          }}
        >
          <Text
            style={{
              marginTop: 16,
              marginBottom: 16,
              fontSize: 18,
              lineHeight: "28px",
              fontWeight: 600,
              color: "rgb(79,70,229)",
            }}
          >
            Dawbell Auto Coverage
          </Text>
          <Heading
            as="h1"
            style={{
              margin: "0px",
              marginTop: 8,
              fontSize: 36,
              lineHeight: "36px",
              fontWeight: 600,
              color: "rgb(17,24,39)",
            }}
          >
            We're working on your request
          </Heading>
          <Text style={{ fontSize: 16, lineHeight: "24px", color: "rgb(107,114,128)" }}>
            We're now working on your request. Our AI agents are now searching editorals, and you'll shortly receive an
            email when it's ready.
          </Text>
          <Button
            href="https://react.email"
            style={{
              marginTop: 16,
              borderRadius: 8,
              backgroundColor: "rgb(79,70,229)",
              paddingLeft: 40,
              paddingRight: 40,
              paddingTop: 12,
              paddingBottom: 12,
              fontWeight: 600,
              color: "rgb(255,255,255)",
            }}
          >
            Find out more
          </Button>
        </Section>
      </Section>
    </Body>
  </Html>
);
