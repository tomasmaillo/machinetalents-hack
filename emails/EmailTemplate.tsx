import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface EmailTemplateProps {
  articles: {
    title: string
    url: string
    description: string
    editorial: string
  }[]
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  articles,
}) => (
  <Html>
    <Head />
    <Body
      style={{
        backgroundColor: '#fff',
        fontFamily:
          '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
      }}>
      <Container style={{ margin: '0 auto', padding: '20px 0 48px' }}>
        <Heading
          style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginTop: '48px',
          }}>
          Your Research Results
        </Heading>
        {articles.map((article, index) => (
          <div key={index} style={{ marginBottom: '24px' }}>
            <Heading as="h2" style={{ fontSize: '20px', fontWeight: '600' }}>
              <Link href={article.url}>{article.title}</Link>
            </Heading>
            <Text style={{ fontSize: '16px', color: '#525f7f' }}>
              {article.description}
            </Text>
            <Text
              style={{
                fontSize: '14px',
                fontStyle: 'italic',
                color: '#8898aa',
              }}>
              - {article.editorial}
            </Text>
          </div>
        ))}
      </Container>
    </Body>
  </Html>
)
