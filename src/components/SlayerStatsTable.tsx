import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { Table, TableBody, TableCell, TableRow } from "./ui/table";

// TESTING ONLY!!!
// Take a color for rarity starting from gray -> green -> blue -> purple -> orange
const randomRarity = () => {
  const rarity = Math.floor(Math.random() * 5);
  switch (rarity) {
    case 0:
      return "text-gray-400";
    case 1:
      return "text-green-400";
    case 2:
      return "text-blue-400";
    case 3:
      return "text-purple-400";
    case 4:
      return "text-orange-400";
    default:
      return "text-gray-400";
  }
};

const SlayerStatsTable = ({ attributes }: { attributes: any }) => {
  return (
    <Table className="w-full rounded-lg overflow-hidden text-base">
      <TableBody>
        {attributes.map((attribute: any) => (
          <TableRow key={attribute.trait_type}>
            <TableCell className="font-semibold">
              {attribute.trait_type}
            </TableCell>
            <TableCell className="">{attribute.value}</TableCell>
            <TableCell className="">
              <FontAwesomeIcon
                icon={faCircle}
                className={`${randomRarity()}`}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SlayerStatsTable;
