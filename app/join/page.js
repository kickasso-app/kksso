import JoinClient from './JoinClient';

export const metadata = {
  title: 'Join Arti - Sign Up or Login',
  description: 'Join Arti to connect with artists and art lovers.',
};

export default async function JoinPage({ searchParams }) {
  const { referral } = await searchParams;
  return <JoinClient referral={referral} />;
}
