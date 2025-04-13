"use client"
import React, { useEffect, useState } from "react"
import {  useParams } from "next/navigation"
// import Link from "next/link"
import { 
  ExternalLink, 
  // Building2, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  // ChevronRight, 
  // ChevronDown,
  DollarSign 
} from "lucide-react"
import { Badge } from "@src/components/ui/badge"
import { Button } from "@src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@src/components/ui/card"
// import { Separator } from "@src/components/ui/separator"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  } from "@src/components/ui/accordion"
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@src/components/ui/collapsible"
// import { useIsMobile } from "@src/hooks/use-mobile"
import request from "@src/config/axios"
import { toast } from "react-toastify"

interface Product {
  _id: string;
  title: string;
  description: string;
  benefits: string[];
  tags: string[];
  introMedia: {
    video: {
      duration: number;
      name: string;
      url: string;
    };
    coverImage: {
      name: string;
      url: string;
    };
  };
  price: number;
  currency: string;
  creator: string;
  sections: {
    sectionTitle: string;
    items: {
      type: string;
      title: string;
      description: string;
      mediaUrl: string[];
      downloadable: boolean;
      thumbnailUrl?: string;
      duration: number;
      size: number;
      ext?: string;
      _id: string;
    }[];
    _id: string;
  }[];
  mediaInfo: {
    videos: {
      count: number;
      duration: number;
    };
    audios: {
      count: number;
      duration: number;
    };
    imagesCount: number;
    documentsCount: number;
  };
  analytics: {
    views: number;
    purchases: number;
    conversionRate: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function DigitalProductView() {
  const { id } = useParams()
  // const isMobile = useIsMobile()
  // const [isOpen, setIsOpen] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await request.get(`/product/${id}`)
        setProduct(response.data)
        setLoading(false)
        console.log(response.data, "response.data")
      } catch (error) {
        console.error("Error fetching product:", error)
        toast.error("Failed to fetch product details")
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  if (loading) {
    return <div className="container p-6">Loading...</div>
  }

  if (!product) {
    return <div className="container p-6">Product not found</div>
  }

  const getMediaIcon = (mediaType: string) => {
    switch (mediaType) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'image':
        return <ImageIcon className="h-4 w-4" />;
      case 'document':
      case 'doc':
      case 'text':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const openMediaDialog = (type: string, url: string, title: string) => {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-4 w-full max-w-4xl">
          <div class="flex justify-end mb-2">
            <button class="text-gray-500 hover:text-gray-700" onclick="this.closest('dialog').close()">
              ✕
            </button>
          </div>
          ${type === 'video' 
            ? `<video src="${url}" controls class="w-full" autoplay></video>`
            : type === 'image'
            ? `<img src="${url}" alt="${title}" class="w-full h-auto max-h-[80vh] object-contain" />`
            : `<iframe src="${url}" title="${title}" class="w-full h-[80vh]" />`
          }
        </div>
      </div>
    `;
    document.body.appendChild(dialog);
    dialog.showModal();
    dialog.addEventListener('close', () => {
      dialog.remove();
    });
  };

  return (
    <div className="container space-y-6 p-6 pb-16">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          <p className="text-muted-foreground">Digital Product Details</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <a 
              href={`https://muab.network/profile/${product.creator}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              <span>MUAB Network Profile</span>
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Benefits</h3>
              <ul className="mt-2 space-y-1 pl-5 text-sm">
                {product.benefits.filter(benefit => benefit).map((benefit, index) => (
                  <li key={index} className="list-disc">{benefit}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Tags</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Preview</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="relative aspect-video w-full overflow-hidden rounded-md">
              <img 
                src={product.introMedia.coverImage.url} 
                alt={product.title} 
                className="h-full w-full object-cover"
              />
              {product.introMedia.video && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <Button 
                    variant="outline" 
                    className="bg-white/20 backdrop-blur-sm"
                    onClick={() => {
                      openMediaDialog('video', product.introMedia.video.url, product.title);
                    }}
                  >
                    <Video className="h-6 w-6" />
                    <span className="ml-2">Watch Video</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 border-primary/10 bg-accent/50">
        <CardHeader>
          <CardTitle>Pricing</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="flex items-center justify-center text-3xl font-bold text-primary">
              <DollarSign className="h-6 w-6" />
              <span>{product.price.toFixed(2)}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">One-time purchase</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Content</CardTitle>
          <CardDescription>
            {product.sections.length} sections • {product.sections.reduce((acc, section) => acc + section.items.length, 0)} elements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {product.sections.map((section) => (
              <AccordionItem key={section._id} value={section._id}>
                <AccordionTrigger className="text-lg font-medium">
                  {section.sectionTitle}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pl-4">
                    {section.items.map((item) => (
                      <div key={item._id} className="space-y-2 border-l border-border pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{item.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.type === 'text' ? (
                                <div dangerouslySetInnerHTML={{ __html: item.description }} />
                              ) : (
                                item.description
                              )}
                            </p>
                          </div>
                          {item.mediaUrl.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="flex items-center gap-1"
                              onClick={() => {
                                openMediaDialog(item.type, item.mediaUrl[0], item.title);
                              }}
                            >
                              {getMediaIcon(item.type)}
                              <span className="ml-1">View</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
