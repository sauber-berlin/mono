import { getTranslations } from 'next-intl/server';

export default async function Home() {
  const t = await getTranslations('common');
  return <h1 className="text-3xl font-bold underline">{t('welcome')}</h1>;
}