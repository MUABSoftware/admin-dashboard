"use client"
import { useParams } from "next/navigation"
import { MapPin, Calendar, Building, Tag, Mail, Phone, Briefcase, User, Info, Globe, Instagram, Linkedin, Twitter, Facebook } from "lucide-react"
import { Badge } from "@src/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@src/components/ui/card"
import { useEffect, useState } from "react"
import request from "@src/config/axios"
import { BusinessSpaceDetail, ApiResponse, } from "@src/types"
import { Separator } from "@src/components/ui/separator"
import { BusinessDetailActions } from "@src/components/business-spaces/BusinessDetailActions"
import { useRouter } from "next/navigation"
import { Button } from "@src/components/ui/button"


export default function BusinessSpaceDetails() {
    const router = useRouter();
    const { id } = useParams()
    const [space, setSpace] = useState<BusinessSpaceDetail | null>(null)
    const [businessSpaces, setBusinessSpaces] = useState<BusinessSpaceDetail[]>([]);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const currentIndex = businessSpaces.findIndex(item => item._id === id);

    useEffect(() => {
        let isSubscribed = true;

        const fetchData = async () => {
            try {
                // Fetch current business space
                const spaceResponse = await request.get(`/business/${id}`);
                
                if (!isSubscribed) return;

                if (spaceResponse.status !== 200) {
                    throw new Error('Failed to fetch business space');
                }

                const spaceData: ApiResponse = spaceResponse.data;
                setSpace(spaceData.user);

                // Fetch all business spaces
                const allSpacesResponse = await request.get('/business');
                if (!isSubscribed) return;

                const allSpacesData = allSpacesResponse.data;
                // Match the data structure from the table component
                setBusinessSpaces(allSpacesData.data || []);
                
            } catch (err) {
                if (!isSubscribed) return;
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                if (!isSubscribed) return;
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            isSubscribed = false;
        };
    }, [id]);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            const previousId = businessSpaces[currentIndex - 1]._id;
            console.log('Previous ID:', previousId);
            router.push(`/business-spaces/${previousId}`);
        }
    };

    const handleNext = () => {
        if (currentIndex < businessSpaces.length - 1) {
            const nextId = businessSpaces[currentIndex + 1]._id;
            console.log('Next ID:', nextId);
            router.push(`/business-spaces/${nextId}`);
        }
    };

    if (loading) {
        return (
            <div className="container space-y-6 p-6 pb-16 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Status & Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="h-6 w-20 bg-gray-200 rounded"></div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
                            </div>
                            <div>
                                <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                                <div className="h-20 bg-gray-200 rounded"></div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                                <div className="flex gap-2">
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                    <div className="h-6 w-16 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    if (error) {
        return <div className="container p-6">Error: {error}</div>
    }

    if (!space) {
        return <div className="container p-6">No business space found</div>
    }

    const notAvailable = <span className="text-muted-foreground">Not available</span>

    const socialMediaLinks = [
        {
            label: 'Website',
            icon: Globe,
            url: space.socialMedia.website,
            color: 'text-blue-600'
        },
        {
            label: 'Instagram',
            icon: Instagram,
            url: space.socialMedia.instagram,
            color: 'text-pink-600'
        },
        {
            label: 'LinkedIn',
            icon: Linkedin,
            url: space.socialMedia.linkedIn,
            color: 'text-blue-600'
        },
        {
            label: 'Twitter',
            icon: Twitter,
            url: space.socialMedia.twitter,
            color: 'text-blue-500'
        },
        {
            label: 'Facebook',
            icon: Facebook,
            url: space.socialMedia.facebook,
            color: 'text-blue-600'
        }
    ];

    return (
        <div className="container space-y-6 p-6 pb-16">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <h2 className="text-2xl font-bold tracking-tight">{space.tradeName.length > 50 ? space.tradeName.slice(0, 50) + '...' : space.tradeName}</h2>
                    <p className="text-muted-foreground">Business ID: {space.businessId}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex gap-2">
                        <BusinessDetailActions business={space} />
                        {businessSpaces.length > 0 && currentIndex !== -1 && (
                            <>
                                <Button
                                    onClick={handlePrevious}
                                    disabled={currentIndex <= 0}
                                    variant="outline"
                                    className="flex items-center gap-1 bg-Table-Header-Color font-CustomPrimary-Color text-white disabled:opacity-50"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 18l-6-6 6-6"/>
                                    </svg>
                                    Previous
                                </Button>
                                <Button
                                    onClick={handleNext}
                                    disabled={currentIndex >= businessSpaces.length - 1}
                                    variant="outline"
                                    className="flex items-center gap-1 bg-Table-Header-Color font-CustomPrimary-Color text-white disabled:opacity-50"
                                >
                                    Next
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 18l6-6-6-6"/>
                                    </svg>
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">Legal Name: </span>
                            <span>{space.legalName.length > 50 ? space.legalName.slice(0, 50) + '...' : space.legalName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">Address: </span>
                            <span>
                                {space.address.city}, {space.address.country}
                                {space.address.state && `, ${space.address.state}`}
                                {space.address.postalCode && ` ${space.address.postalCode}`}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">Created: </span>
                            <span>{new Date(space.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-semibold">Updated: </span>
                            <span>{new Date(space.updatedAt).toLocaleDateString()}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Status & Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-muted-foreground font-semibold">Status:</span>
                            <Badge variant="outline">{space.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground font-semibold">Category ID: </span>
                            <span>{space.category}</span>
                        </div>
                        {/* {space.description && (
                            <div className="flex gap-2">
                                <span className="text-muted-foreground font-semibold">Description: </span>
                                <span className="break-words whitespace-pre-wrap overflow-auto max-h-[200px] leading-relaxed font-normal">
                                    {space.description}
                                </span>
                            </div>
                        )} */}
                        {space.tags && space.tags.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-muted-foreground" />
                                <div className="flex flex-wrap gap-1">
                                    {space.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline">{tag}</Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Full Name:</span>
                            <span>{space.tradeName.length > 50 ? space.tradeName.slice(0, 50) + '...' : space.tradeName || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email:</span>
                            <span>{space.email || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Phone:</span>
                            <span>{space.phoneNumber || notAvailable}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Business Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Business Name:</span>
                            <span>{space.uniqueName || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Location:</span>
                            <span>{space.address.country || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Unique Name:</span>
                            <span>{space.uniqueName || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Industry:</span>
                            <span>{space.category || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Founded Date:</span>
                            <span>{new Date(space.createdAt).toLocaleDateString() || notAvailable}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Company Size:</span>
                            <span>{space.companySize || notAvailable}</span>
                        </div>
                    </div>
                    
                    <Separator className="my-4" />
                    <div className="space-y-4">
                        <div>
                            <span className="font-medium">Headline:</span>
                            <p className="mt-1">{space.headline || notAvailable}</p>
                        </div>

                        <div>
                            <span className="font-medium">Description:</span>
                            <p className="mt-1">{space.description || notAvailable}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-8">
                        {socialMediaLinks.map((social, index) => {
                            const Icon = social.icon;
                            const isDisabled = !social.url;
                            
                            return (
                                <a 
                                    key={index}
                                    href={social.url || '#'} 
                                    onClick={(e) => isDisabled && e.preventDefault()}
                                    className={`flex items-center gap-2 ${
                                        isDisabled 
                                        ? 'text-gray-400 cursor-not-allowed opacity-50' 
                                        : `${social.color} hover:underline cursor-pointer`
                                    }`}
                                >
                                    <Icon className={`h-4 w-4 ${isDisabled ? 'text-gray-400' : social.color}`} />
                                    {social.label}
                                </a>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}