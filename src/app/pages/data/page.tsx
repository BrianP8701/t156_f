// src/app/pages/data/page.tsx
"use client";
import React, { useState, useEffect } from 'react';

import { Menu } from "lucide-react";
import { ThreeDots } from 'react-loader-spinner';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { VisibilityState } from '@tanstack/react-table';

import MainLayout from '@/components/layouts/MainLayout';

import RenderTab from '@/app/pages/data/renderTab';
import { DataNavigation } from '@/app/pages/data/dataNavigation';

import { useFetchDataEffect } from '@/app/pages/data/useFetchDataEffect';

const DataPage = () => {
    const [xPadding, setXPadding] = useState<number>(100)
    const [isNavVisible, setIsNavVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    // Table stuff
    const [data, setData] = useState(null);
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    useFetchDataEffect({ setData, setIsLoading })

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1320) {
                setXPadding(0)
                setIsNavVisible(false);
            } else {
                setXPadding(100)
                setIsNavVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call once to set initial state based on current window size

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        console.log(rowSelection)
    }, [rowSelection]);

    return (
        <MainLayout title="Data">
            <div style={{
                width: '100%',
                height: '100%',
                display: 'grid',
                gridTemplateColumns: isNavVisible ? '190px 1fr' : '1fr',
                position: 'relative' // Add relative positioning here
            }}>
                {isNavVisible && (
                    <div className="border-r p-3">
                        <DataNavigation />
                    </div>
                )}
                <div style={{
                    paddingLeft: xPadding,
                    paddingRight: xPadding,
                    flexGrow: 1, // Make sure it takes up all available space
                    display: 'flex', // Use flex to fill the area
                    flexDirection: 'column' // Stack children vertically
                }}>
                    <RenderTab
                        data={data}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        columnVisibility={columnVisibility}
                        setColumnVisibility={setColumnVisibility}
                    />
                </div>
                {isLoading && (
                    <div style={{
                        position: 'absolute', // Overlay the loader
                        top: '15px', // Distance from the top
                        right: '15px', // Distance from the right
                        zIndex: 1000, // Ensure it's on top of other content
                        color: 'var(--secondary)' // Using CSS variable for secondary color
                    }}>
                        <ThreeDots height={50} width={50} color="currentColor" />
                    </div>
                )}
            </div>
            {!isNavVisible && (
                <Sheet >
                    <SheetTrigger>
                        <Menu className="h-8 w-8" style={{ position: 'absolute', top: 60, left: 60 }} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[200px]">
                        <DataNavigation />
                    </SheetContent>
                </Sheet>
            )}
        </MainLayout>
    );
};

export default DataPage;
