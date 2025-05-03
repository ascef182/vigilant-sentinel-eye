
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, AlertCircle, Shield, Search, Loader2 } from 'lucide-react';
import { useOtx } from '@/hooks/useOtx';

const OtxThreatAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('lookup');
  const [lookupType, setLookupType] = useState('ip');
  const [inputValue, setInputValue] = useState('');
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  const { 
    apiKey,
    setApiKey, 
    useLatestPulses,
    checkIp,
    checkDomain,
    checkFileHash,
    useGlobalThreatMap
  } = useOtx();
  
  const { data: pulses, isLoading: isPulsesLoading } = useLatestPulses(5);
  
  const handleSearch = () => {
    if (!inputValue) return;
    
    switch (lookupType) {
      case 'ip':
        checkIp.mutate(inputValue);
        break;
      case 'domain':
        checkDomain.mutate(inputValue);
        break;
      case 'file':
        checkFileHash.mutate(inputValue);
        break;
      default:
        break;
    }
  };
  
  const handleSetApiKey = () => {
    if (apiKeyInput) {
      setApiKey(apiKeyInput);
      setApiKeyInput('');
    }
  };
  
  const isLoading = checkIp.isPending || checkDomain.isPending || checkFileHash.isPending;
  const result = checkIp.data || checkDomain.data || checkFileHash.data;
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-primary/5 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Shield size={18} className="text-primary" />
          <span>LevelBlue OTX - Inteligência de Ameaças</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="lookup">Verificação de IOCs</TabsTrigger>
            <TabsTrigger value="pulses">Pulses Recentes</TabsTrigger>
            <TabsTrigger value="config">Configuração</TabsTrigger>
          </TabsList>
          
          <TabsContent value="lookup" className="space-y-4">
            <div className="grid gap-4">
              <RadioGroup 
                value={lookupType} 
                onValueChange={setLookupType} 
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ip" id="ip" />
                  <Label htmlFor="ip">Endereço IP</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="domain" id="domain" />
                  <Label htmlFor="domain">Domínio</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="file" id="file" />
                  <Label htmlFor="file">Hash de Arquivo</Label>
                </div>
              </RadioGroup>
              
              <div className="flex gap-2">
                <Input 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={lookupType === 'ip' ? '8.8.8.8' : 
                              lookupType === 'domain' ? 'example.com' : 
                              'MD5, SHA1 ou SHA256'}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isLoading || !inputValue}
                  className="gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Verificar
                </Button>
              </div>
              
              {result && (
                <div className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Resultado da Análise</h4>
                    {result.pulse_info?.count > 0 ? (
                      <Badge variant="destructive" className="gap-1">
                        <AlertCircle className="h-3 w-3" />
                        Potencial Ameaça
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                        Não Detectado
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-1">
                      <span className="text-muted-foreground">Pulses:</span>
                      <span className="font-mono">{result.pulse_info?.count || 0}</span>
                      
                      {lookupType === 'ip' && (
                        <>
                          <span className="text-muted-foreground">País:</span>
                          <span className="font-mono">{result.country_name || 'N/A'}</span>
                          
                          <span className="text-muted-foreground">ASN:</span>
                          <span className="font-mono">{result.asn || 'N/A'}</span>
                        </>
                      )}
                      
                      {lookupType === 'domain' && (
                        <>
                          <span className="text-muted-foreground">Categorias:</span>
                          <span className="font-mono">{(result.category || []).join(', ') || 'N/A'}</span>
                        </>
                      )}
                      
                      {lookupType === 'file' && (
                        <>
                          <span className="text-muted-foreground">Tipo:</span>
                          <span className="font-mono">{result.analysis?.info?.file_type || 'N/A'}</span>
                        </>
                      )}
                    </div>
                    
                    {result.pulse_info?.count > 0 && (
                      <div className="mt-2">
                        <h5 className="text-sm font-medium mb-1">Pulses Encontrados:</h5>
                        <ul className="text-xs space-y-1 max-h-32 overflow-y-auto">
                          {result.pulse_info.pulses?.slice(0, 5).map((pulse: any, idx: number) => (
                            <li key={idx} className="border-l-2 border-destructive pl-2">
                              {pulse.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pulses">
            <div className="space-y-4">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Globe size={16} />
                Feeds de Ameaças Recentes
                {isPulsesLoading && <Loader2 className="h-3 w-3 animate-spin" />}
              </h3>
              
              {isPulsesLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : pulses?.results ? (
                <div className="space-y-3">
                  {pulses.results.map((pulse: any) => (
                    <div key={pulse.id} className="border rounded-md p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium text-sm">
                          {pulse.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {new Date(pulse.created).toLocaleDateString()}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        {pulse.description?.substring(0, 120)}
                        {pulse.description?.length > 120 ? '...' : ''}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {pulse.tags.slice(0, 5).map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {pulse.tags.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pulse.tags.length - 5}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  Sem dados de pulses disponíveis
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-4">
            <h3 className="text-sm font-medium">Configuração da API OTX</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Configure sua chave de API da LevelBlue OTX para acessar os dados de inteligência de ameaças.
              </p>
              <div className="flex gap-2">
                <Input 
                  type="password"
                  value={apiKeyInput} 
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Insira sua chave de API OTX"
                  className="flex-1"
                />
                <Button onClick={handleSetApiKey}>
                  Salvar
                </Button>
              </div>
              {apiKey && (
                <p className="text-xs text-muted-foreground mt-1">
                  Status: API configurada ✓
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OtxThreatAnalyzer;
