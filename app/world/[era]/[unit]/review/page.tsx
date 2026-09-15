import { getAllUnitParams } from "@/lib/content";
import { UnitReviewPage } from "@/components/UnitReviewPage";
export function generateStaticParams(){return getAllUnitParams("world")}
export default async function Page({params}:{params:Promise<{era:string;unit:string}>}){const {era,unit}=await params;return <UnitReviewPage track="world" era={era} unit={unit}/>}
