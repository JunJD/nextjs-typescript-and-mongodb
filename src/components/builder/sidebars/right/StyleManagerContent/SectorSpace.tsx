import PropertyComposite from "@/components/builder/sidebars/right/StyleManagerContent/PropertyComposite";

export interface Props extends React.HTMLProps<HTMLDivElement> {
    sector: any,
};

export default function SectorSpace({ sector }: Props) {
    return (
        <>
            <PropertyComposite  property={sector.getProperty('padding')}/>
            <PropertyComposite  property={sector.getProperty('margin')}/>
        </>
    );
  }