import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";

const Details = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p></p>
      </CardContent>
    </Card>
  );
};

export default Details;
