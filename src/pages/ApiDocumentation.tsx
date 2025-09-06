import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Book, ExternalLink, Copy } from 'lucide-react';

export default function ApiDocumentation() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const endpoints = [
    {
      method: 'GET',
      path: '/api/v1/products',
      description: 'List all products',
      response: 'Array of product objects'
    },
    {
      method: 'POST',
      path: '/api/v1/products',
      description: 'Create a new product',
      response: 'Created product object'
    },
    {
      method: 'GET',
      path: '/api/v1/orders',
      description: 'List orders',
      response: 'Array of order objects'
    },
    {
      method: 'POST',
      path: '/api/v1/orders',
      description: 'Create a new order',
      response: 'Created order object'
    },
    {
      method: 'PATCH',
      path: '/api/v1/orders/{id}',
      description: 'Update order status',
      response: 'Updated order object'
    }
  ];

  const exampleCode = `// Example API Usage
const apiKey = 'your_api_key_here';

// Create a new product
const response = await fetch('https://api.o2solutions.com/v1/products', {
  method: 'POST',
  headers: {
    'Authorization': \`Bearer \${apiKey}\`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'My Product',
    description: 'Product description',
    type: 'Service',
    price: 99.99
  })
});

const product = await response.json();`;

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-o2-blue" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
            <p className="text-muted-foreground">O2 Partner API Reference Guide</p>
          </div>
        </div>

        {/* Overview */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground">
              The O2 Partner API allows you to programmatically manage products, orders, and integration data. 
              All API requests require authentication using an API key.
            </p>
            
            <div className="bg-o2-blue-subtle p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Base URL</h4>
              <div className="flex items-center space-x-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">
                  https://api.o2solutions.com/v1
                </code>
                <Button size="sm" variant="outline" onClick={() => copyToClipboard('https://api.o2solutions.com/v1')}>
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div className="bg-warning-subtle p-4 rounded-lg">
              <h4 className="font-semibold text-foreground mb-2">Authentication</h4>
              <p className="text-sm text-foreground mb-2">
                Include your API key in the Authorization header:
              </p>
              <code className="bg-muted px-2 py-1 rounded text-sm block">
                Authorization: Bearer your_api_key_here
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="border border-border rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge 
                      variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                      className={
                        endpoint.method === 'GET' ? 'bg-success text-success-foreground' :
                        endpoint.method === 'POST' ? 'bg-o2-blue text-white' :
                        'bg-warning text-warning-foreground'
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-foreground mb-1">{endpoint.description}</p>
                  <p className="text-xs text-muted-foreground">Returns: {endpoint.response}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Example */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Code Example
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                <code>{exampleCode}</code>
              </pre>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(exampleCode)}
              >
                <Copy className="w-3 h-3 mr-1" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Response Format */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Response Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Success Response</h4>
                <pre className="bg-muted p-3 rounded text-sm">
{`{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-22T10:30:00Z"
}`}
                </pre>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Error Response</h4>
                <pre className="bg-destructive/10 p-3 rounded text-sm">
{`{
  "success": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Description of the error"
  },
  "timestamp": "2024-01-22T10:30:00Z"
}`}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-foreground">
                  Contact our API support team for assistance with integration.
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Monday-Friday, 9AM-5PM GMT
                </p>
              </div>
              <Button className="bg-o2-blue hover:bg-o2-blue-dark">
                <ExternalLink className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}