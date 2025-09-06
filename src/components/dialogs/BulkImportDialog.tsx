import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

interface BulkImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (products: any[]) => void;
}

export function BulkImportDialog({ open, onOpenChange, onImport }: BulkImportDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ success: number; errors: number } | null>(null);
  const { addNotification } = useNotifications();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const processFile = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProgress(0);

    // Simulate file processing
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setProgress((i / steps) * 100);
    }

    // Mock parsed products
    const mockProducts = [
      {
        id: `PROD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: 'Bulk Product 1',
        description: 'Product imported from CSV',
        type: 'Service',
        price: 99.99,
        status: 'pending-review',
        sourcePartner: 'Your Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: `PROD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
        name: 'Bulk Product 2',
        description: 'Another product from CSV',
        type: 'Software',
        price: 149.99,
        status: 'pending-review',
        sourcePartner: 'Your Company',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    onImport(mockProducts);
    setResults({ success: mockProducts.length, errors: 0 });
    setIsProcessing(false);

    addNotification({
      title: 'Bulk Import Complete',
      message: `Successfully imported ${mockProducts.length} products`,
      type: 'success'
    });
  };

  const handleClose = () => {
    setFile(null);
    setProgress(0);
    setResults(null);
    setIsProcessing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Upload className="w-5 h-5 mr-2 text-o2-blue" />
            Bulk Import Products
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!isProcessing && !results && (
            <>
              <div className="text-sm text-muted-foreground">
                Upload a CSV or XLS file to import multiple products at once.
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file">Choose File</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>
              
              {file && (
                <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                  <FileText className="w-4 h-4 text-o2-blue" />
                  <span className="text-sm text-foreground">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground">
                Expected format: Name, Description, Type, Price
              </div>
            </>
          )}

          {isProcessing && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-foreground">Processing file...</div>
              <Progress value={progress} className="w-full" />
              <div className="text-xs text-muted-foreground">
                Parsing data and validating products
              </div>
            </div>
          )}

          {results && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Import Complete!</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-success-subtle rounded-lg">
                  <div className="text-2xl font-bold text-success">{results.success}</div>
                  <div className="text-sm text-muted-foreground">Successful</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-muted-foreground">{results.errors}</div>
                  <div className="text-sm text-muted-foreground">Errors</div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose}>
              {results ? 'Close' : 'Cancel'}
            </Button>
            {file && !isProcessing && !results && (
              <Button onClick={processFile}>
                Import Products
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}