import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import data from "@/data/Slayers_csvjson.json";
import SlayerCard from "./SlayerCard";

const Imageview = () => {
  const itemsPerPage = 16;
  const [currentPage, setCurrentPage] = useState(1);
  const paginationNumber = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section className="flex flex-wrap w-full gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            {currentPage > 1 ? (
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer"
              />
            ) : (
              <PaginationPrevious className="opacity-20 pointer-events-none transition-all" />
            )}
          </PaginationItem>
          {Array.from({ length: 3 }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                className="cursor-pointer"
                onClick={() => handlePageChange(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage > 3 && currentPage != paginationNumber ? (
            <PaginationItem className="mx-6">
              <PaginationLink className="cursor-pointer" isActive={true}>
                {currentPage}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationEllipsis className="mx-6" />
          )}
          <PaginationItem>
            <PaginationLink
              className="cursor-pointer"
              onClick={() => handlePageChange(paginationNumber)}
              isActive={currentPage === paginationNumber}
            >
              {paginationNumber}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            {currentPage < paginationNumber ? (
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className="cursor-pointer"
              />
            ) : (
              <PaginationNext className="opacity-20 pointer-events-none transition-all" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <div className="grid w-full grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4">
        {paginatedData.map((slayer) => {
          return <SlayerCard slayer={slayer} />;
        })}
      </div>
    </section>
  );
};

export default Imageview;
