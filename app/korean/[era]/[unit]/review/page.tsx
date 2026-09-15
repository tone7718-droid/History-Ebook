import { getAllUnitParams } from "@/lib/content";
import { UnitReviewPage } from "@/components/UnitReviewPage";
export function generateStaticParams(){return getAllUnitParams("korean")}
export default async function Page({params}:{params:Promise<{era:string;unit:string}>}){const {era,unit}=await params;return <UnitReviewPage track="korean" era={era} unit={unit}/>}
