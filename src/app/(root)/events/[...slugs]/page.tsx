import { Metadata } from "next";
import { last } from "lodash";
import { getEventPublicById } from "@/modules/services/eventService";
import EventRender from "@/components/event-render";

const Page = async (props: {
  params: Promise<{ slugs: string[]; locale: string }>;
}) => {
  const params = await props.params;

  const res = await getEventPublicById(last(params.slugs) || "");

  console.log("Event Data:", res);

  return <EventRender eventData={res || undefined}  />;
};

export async function generateMetadata(context: {
  params: Promise<{ slugs?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await context.params;
  const { slugs = [] } = resolvedParams;
  const event = await getEventPublicById(last(slugs) || "");

  return {
    title: `${event?.title}`,
    description: event?.content?.slice(0, 150),
    openGraph: {
      title: `${event?.title}`,
      description: event?.content?.slice(0, 150),
      images: [{ url: event?.image || "/default-image.jpg" }],
    },
  };
}

export default Page;
