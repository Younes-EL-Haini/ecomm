import {
  Html,
  Body,
  Container,
  Text,
  Heading,
  Hr,
  Section,
  Preview,
  Tailwind,
  Img,
  Row,
  Column,
} from "@react-email/components";

// Mock data so your previewer (localhost:3001) looks beautiful immediately
const previewCart = [
  {
    name: "Black Skinny Jeans",
    q: 1,
    price: 49.99,
    image: "https://placehold.co/100x100.png",
  },
  {
    name: "Puffer Jacket",
    q: 1,
    price: 89.99,
    image: "https://placehold.co/100x100.png",
  },
];
// need to fix
export const OrderConfirmationEmail = ({
  orderId = "pi_3SwQZZEWsuG",
  customerName = "Youness",
  total = 139.98,
  cartItems = previewCart,
}) => {
  const displayId = orderId ? orderId.slice(-8).toUpperCase() : "XXXXXX";

  return (
    <Html>
      <Preview>Order Confirmed! 📦</Preview>
      <Tailwind>
        <Body className="bg-gray-100 py-10 font-sans">
          <Container className="bg-white border border-gray-200 rounded-lg p-8 mx-auto max-w-[600px]">
            {/* Header */}
            <Section className="text-center mb-8">
              <Heading className="text-2xl font-bold text-black m-0 tracking-tighter">
                LOKO SHOP
              </Heading>
            </Section>

            <Heading className="text-xl font-semibold text-gray-900 mb-4">
              Vielen Dank, {customerName}!
            </Heading>

            <Text className="text-gray-600 text-base leading-6 mb-6">
              Great news! We've received your order and we're getting it ready
              to ship. We'll send you another email as soon as it leaves our
              warehouse.
            </Text>

            <Hr className="border-gray-200 my-6" />

            {/* Product List - THE ELITE TOUCH */}
            <Section className="mb-6">
              <Text className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-4">
                Your Items
              </Text>
              {cartItems?.map((item, index: number) => (
                <Row key={index} className="mb-4">
                  <Column className="w-16">
                    <Img
                      src={item.image || "https://placehold.co/100x100.png"}
                      width="64"
                      height="64"
                      className="rounded-md object-cover border border-gray-100"
                    />
                  </Column>
                  <Column className="pl-4">
                    <Text className="text-sm font-bold m-0 text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="text-xs text-gray-500 m-0">
                      Quantity: {item.q}
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text className="text-sm font-bold m-0 text-gray-900">
                      ${item.price.toFixed(2)}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/* Summary Card */}
            <Section className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
              <Row>
                <Column>
                  <Text className="text-[10px] text-gray-400 uppercase font-bold tracking-widest m-0 text-center">
                    Order Number
                  </Text>
                  <Text className="text-sm font-mono font-medium m-0 text-center">
                    #{displayId}
                  </Text>
                </Column>
                <Column className="text-right">
                  <Text className="text-[10px] text-gray-400 uppercase font-bold tracking-widest m-0 text-center">
                    Total Paid
                  </Text>
                  <Text className="text-xl font-bold text-black m-0 text-center">
                    ${Number(total).toFixed(2)}
                  </Text>
                </Column>
              </Row>
            </Section>

            {/* CTA */}
            <Section className="text-center">
              <a
                href={`${process.env.NEXT_PUBLIC_APP_URL}/account/orders/${orderId}`}
                className="bg-black text-white text-[12px] font-bold py-4 px-10 rounded-full no-underline inline-block uppercase tracking-wider"
              >
                Track My Order
              </a>
            </Section>

            <Hr className="border-gray-200 my-8" />

            <Text className="text-[11px] text-gray-400 text-center leading-5">
              Questions? Simply reply to this email. <br />
              Loko Shop GmbH • Berlin, Germany.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OrderConfirmationEmail;
