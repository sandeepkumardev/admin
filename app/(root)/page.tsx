"use client";

import { useCollections } from "@/hook/useCollections";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Collections from "@/components/shared/Collections";
import ListCollections from "@/components/shared/ListCollections";

export default function Home() {
  const { collections, fetchingCollections } = useCollections();

  return (
    <main>
      <h2 className="head-text md:py-6">Home</h2>
      <div className="w-full flex flex-col tablet:flex-row gap-3">
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Add Collection</h2>
            </AccordionTrigger>
            <AccordionContent>
              <Collections />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="item-2">
            <AccordionTrigger className="hover:no-underline">
              <h2 className="text-lg font-semibold text-dark-3">Collections</h2>
            </AccordionTrigger>
            <AccordionContent>
              <ListCollections collections={collections || []} isLoading={fetchingCollections} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </main>
  );
}
