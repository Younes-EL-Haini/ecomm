import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Preview,
} from "@react-email/components";

export const OrderConfirmationEmail = ({
  orderId,
  customerName,
  total,
}: any) => (
  <Html>
    <Preview>Order Confirmed: #ORD-{orderId.slice(-5).toUpperCase()}</Preview>
    <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
      <Container
        style={{
          backgroundColor: "#ffffff",
          padding: "40px",
          borderRadius: "12px",
        }}
      >
        <Heading>Thank you, {customerName}!</Heading>
        <Text>Your order has been received and is being processed.</Text>
        <Hr />
        <Section>
          <Text>
            <strong>Order ID:</strong> {orderId}
          </Text>
          <Text>
            <strong>Total Paid:</strong> ${total}
          </Text>
        </Section>
        <Text style={{ fontSize: "12px", color: "#888" }}>
          You can track your order status in your account dashboard.
        </Text>
      </Container>
    </Body>
  </Html>
);
