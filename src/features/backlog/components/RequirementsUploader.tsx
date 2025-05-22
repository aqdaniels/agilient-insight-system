
import React, { useState } from 'react';
import { Button } from "@/components/design-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUp, FileText, File } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface RequirementsUploaderProps {
  onDocumentProcessed: (text: string) => void;
  isProcessing: boolean;
}

const RequirementsUploader: React.FC<RequirementsUploaderProps> = ({ 
  onDocumentProcessed,
  isProcessing 
}) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const processFile = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a requirements document to upload",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // For supported file types like TXT
      if (file.type === 'text/plain') {
        const text = await file.text();
        onDocumentProcessed(text);
        toast({
          title: "Document processed",
          description: `Successfully processed ${file.name}`,
        });
      } else {
        // For other formats like PDF, DOCX, etc.
        // In a real implementation, you would use a library to extract text
        // This is a simplified version that just uses plain text
        toast({
          title: "Unsupported file format",
          description: "Currently only plain text (.txt) files are supported",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Processing failed",
        description: "Failed to process the document. Please try again.",
        variant: "destructive"
      });
      console.error("Error processing file:", error);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Upload Requirements Document</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:bg-muted/50 transition-colors">
          {file ? (
            <div className="flex flex-col items-center">
              <FileText size={36} className="text-primary mb-2" />
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <File size={36} className="text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Drag and drop your requirements document</p>
              <p className="text-xs text-muted-foreground mt-1">
                or click to browse (.txt files supported)
              </p>
            </div>
          )}
          <input
            type="file"
            id="document-upload"
            className="hidden"
            accept=".txt"
            onChange={handleFileChange}
          />
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => document.getElementById('document-upload')?.click()}
            disabled={isProcessing}
          >
            Select File
          </Button>
          
          <Button
            variant="primary"
            leftIcon={<FileUp size={16} />}
            onClick={processFile}
            disabled={!file || isProcessing}
          >
            {isProcessing ? "Processing..." : "Process Document"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequirementsUploader;
