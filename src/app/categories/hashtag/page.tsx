"use client";

import { Button, Tooltip, Modal, Box } from "@mui/material";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import { Edit, Trash2, CheckCircle, Plus } from "lucide-react";
import { useState } from 'react';

interface Hashtag {
    id: string;
    name: string;
    digitalProductCount: number;
    userCount: number;
    category: string[];
}

const HashtagPage = () => {
    const [open, setOpen] = useState(false);
    const [modalHashtagName, setModalHashtagName] = useState('');
    const [modalCategoryRelated, setModalCategoryRelated] = useState('');

    // const [bottomHashtagName, setBottomHashtagName] = useState('');
    // const [bottomCategoryRelated, setBottomCategoryRelated] = useState('');

    const hashtags: Hashtag[] = [
        {
            id: "1",
            name: "business pass",
            digitalProductCount: 1560,
            userCount: 666,
            category: ["business", "entrepreneurship", "startup"],
        }, {
            id: "2",
            name: "tech hub",
            digitalProductCount: 2340,
            userCount: 892,
            category: ["technology", "programming", "innovation"],
        }, {
            id: "3",
            name: "digital art",
            digitalProductCount: 3450,
            userCount: 1205,
            category: ["art", "design", "creative"],
        }, {
            id: "4",
            name: "marketing",
            digitalProductCount: 1890,
            userCount: 754,
            category: ["marketing", "socialmedia", "branding"],
        },
        {
            id: "5",
            name: "travel blog",
            digitalProductCount: 2100,
            userCount: 987,
            category: ["travel", "adventure", "photography"],
        },
        {
            id: "6",
            name: "fitness lifestyle",
            digitalProductCount: 1620,
            userCount: 1053,
            category: ["fitness", "health", "wellness"],
        },
        {
            id: "7",
            name: "foodie journey",
            digitalProductCount: 2460,
            userCount: 1120,
            category: ["food", "cooking", "restaurants"]
        }
    ];

    const handleEdit = (id: string) => {
        console.log("Edit hashtag:", id);
    };

    const handleDelete = (id: string) => {
        console.log("Delete hashtag:", id);
    };

    const handleApprove = (id: string) => {
        console.log("Approve hashtag:", id);
    };

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setModalHashtagName('');
        setModalCategoryRelated('');
    };

    const handleModalCreate = () => {
        console.log('Creating hashtag from modal:', { 
            hashtagName: modalHashtagName, 
            categoryRelated: modalCategoryRelated 
        });
        setOpen(false);
        setModalHashtagName('');
        setModalCategoryRelated('');
    };

    return (
        <div className="min-h-screen w-full">
            <main className="pt-16">
                <div className="container space-y-8 p-6 pb-16">
                    <div className="flex justify-between items-center">
                        <h1 className="text-3xl font-bold">Hashtag Review</h1>
                        <Tooltip title="Add Hashtag" placement="left" arrow>
                            <Button
                                variant="contained"
                                onClick={handleOpen}
                                sx={{
                                    minWidth: '40px',
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    padding: 0,
                                    color: '#FFF',  
                                }}
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </Tooltip>
                    </div>

                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-title"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                            boxShadow: 24,
                            p: 4,
                        }}>
                            <h2 id="modal-title" className="text-xl font-semibold mb-4">
                                Create New Hashtag
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="hashtagName" className="block text-sm font-medium text-gray-700 mb-1">
                                        #name
                                    </label>
                                    <input
                                        type="text"
                                        id="hashtagName"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={modalHashtagName}
                                        onChange={(e) => setModalHashtagName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="categoryRelated" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category Related #
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryRelated"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={modalCategoryRelated}
                                        onChange={(e) => setModalCategoryRelated(e.target.value)}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 mt-6">
                                    <Button
                                        variant="outlined"
                                        disableRipple
                                        sx={{
                                            color: '#FFF',
                                            backgroundColor: '#1976d2',
                                           
                                        }}
                                        onClick={handleClose}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disableRipple
                                        onClick={handleModalCreate}
                                        sx={{
                                            backgroundColor: '#1976d2',
                                            color: '#FFF',
                                        }}
                                    >
                                        Create
                                    </Button>
                                </div>
                            </div>
                        </Box>
                    </Modal>

                    <Table sx={{ backgroundColor: 'white', border: 1, borderColor: '#ebebeb', borderRadius: 10, }}>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', }}>#name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', }}>digital products #</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', }}>Posts #</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', }}>Related categories</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {hashtags.map((hashtag) => (
                                <TableRow
                                    key={hashtag.id}
                                    hover
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'rgba(0, 0, 0, 0.03) !important'
                                        }
                                    }}
                                >
                                    <TableCell>
                                        <span className="font-medium">{hashtag.name}</span>
                                    </TableCell>
                                    <TableCell>{hashtag.digitalProductCount.toLocaleString()}</TableCell>
                                    <TableCell>{hashtag.userCount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {hashtag.category.map((cat, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 rounded-full bg-gray-100 text-gray-800"
                                                >
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex">
                                            <Tooltip title="Edit" placement="top" arrow>
                                                <span>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        disableRipple
                                                        onClick={() => handleEdit(hashtag.id)}
                                                        sx={{
                                                            minWidth: '40px',
                                                            padding: '4px',
                                                            background: 'none',
                                                            '&:hover': {
                                                                background: 'none !important'
                                                            }
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Delete" placement="top" arrow>
                                                <span>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        disableRipple
                                                        onClick={() => handleDelete(hashtag.id)}
                                                        color="error"
                                                        sx={{
                                                            minWidth: '40px',
                                                            padding: '4px',
                                                            background: 'none',
                                                            '&:hover': {
                                                                background: 'none !important'
                                                            }
                                                        }}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                            <Tooltip title="Approve" placement="top" arrow>
                                                <span>
                                                    <Button
                                                        variant="text"
                                                        size="small"
                                                        disableRipple
                                                        onClick={() => handleApprove(hashtag.id)}
                                                        color="success"
                                                        sx={{
                                                            minWidth: '40px',
                                                            padding: '4px',
                                                            background: 'none',
                                                            '&:hover': {
                                                                background: 'none !important'
                                                            }
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4" />
                                                    </Button>
                                                </span>
                                            </Tooltip>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

 
                </div>
            </main>
        </div>
    );
};

export default HashtagPage;