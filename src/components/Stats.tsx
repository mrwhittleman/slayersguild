import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

const Stats = () => {
  return (
    <aside className="flex flex-col w-full basis-full">
      <Card>
        <CardHeader>
          <CardTitle>Stats</CardTitle>
          <CardDescription>Stats of Slayer XYZ</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Stats of Slayer XYZ</p>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Stats;
