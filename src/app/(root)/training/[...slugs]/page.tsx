import { Metadata } from "next";
import { last } from "lodash";
import { getPublicTrainingById } from "@/modules/services/trainingService";
import TrainingRender from "@/components/training-render";

const Page = async (props: {
  params: Promise<{ slugs: string[]; locale: string }>;
}) => {
  const params = await props.params;

  const res = await getPublicTrainingById(last(params.slugs) || "");

  return <TrainingRender trainingData={res || undefined} />;
};

export async function generateMetadata(context: {
  params: Promise<{ slugs?: string[] }>;
}): Promise<Metadata> {
  const resolvedParams = await context.params;
  const { slugs = [] } = resolvedParams;
  const training = await getPublicTrainingById(last(slugs) || "");

  return {
    title: training?.title || "Training Details",
    description: training?.description?.slice(0, 150) || "",
    openGraph: {
      title: training?.title || "Training Details",
      description: training?.description?.slice(0, 150) || "",
      images: [{ url: training?.image || "/default-image.jpg" }],
    },
  };
}

export default Page;
