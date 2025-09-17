import ReactCountUpWrapper from "@/components/ReactCountUpWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface Props {
  title: string;
  value: number;
  icon: LucideIcon;
}

/**
 * Dashboard statistic card that displays a title, an animated numeric value, and a decorative icon.
 *
 * Renders a Card with the provided `title` as the header, `value` shown using an animated count-up,
 * and `icon` rendered as a large, low-opacity background graphic for decoration.
 *
 * @param props.title - Heading text shown in the card header.
 * @param props.value - Numeric value displayed and animated via ReactCountUpWrapper.
 * @param props.icon - Icon component (LucideIcon) rendered decoratively behind the header.
 * @returns A React element representing the stats card.
 */
export default function StatsCard(props: Props) {
  return (
    <Card className="relative overflow-hidden h-full">
      <CardHeader className="flex pb-2">
        <CardTitle>{props.title}</CardTitle>
        <props.icon
          size={120}
          className="text-muted-foreground absolute -bottom-4 -right-8 stroke-primary opacity-10"
        />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary">
          <ReactCountUpWrapper value={props.value} />
        </div>
      </CardContent>
    </Card>
  );
}
