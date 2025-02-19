// file path: src/pages/brands/[slug].tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

import { AnalysisProgress } from '@/components/brands/AnalysisProgress';
import { BrandTab } from '@/types/brand';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { AnalysisProgress as ProgressType } from '@/lib/services/brandAnalysis';
import { useBrand } from '@/context/BrandContext';
import { useRouter } from 'next/router';

export default function BrandDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const { brandsInfo, analyzeBrand, cancelAnalysis, isAnalyzing, loadSavedAnalysis, hasAnalysis } = useBrand();
  const [activeTab, setActiveTab] = useState<BrandTab>('overview');
  const [analysisProgress, setAnalysisProgress] = useState<ProgressType>({
    currentStep: 'presence',
    completedSteps: []
  });
  const [hasExistingAnalysis, setHasExistingAnalysis] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  const brand = Object.values(brandsInfo).find(b => b.slug === slug);

  const checkExistingAnalysis = useCallback(async (isMounted: () => boolean) => {
    if (!brand) return;
    
    try {
      const exists = await hasAnalysis(brand.name);
      if (isMounted()) {
        setHasExistingAnalysis(exists);
        if (exists) {
          await loadSavedAnalysis(brand.name);
        }
      }
    } catch (error) {
      console.error('Error checking analysis:', error);
    } finally {
      if (isMounted()) {
        setIsLoadingAnalysis(false);
      }
    }
  }, [brand?.name, hasAnalysis, loadSavedAnalysis]);

  useEffect(() => {
    let mounted = true;
    const isMounted = () => mounted;

    if (brand) {
      setIsLoadingAnalysis(true);
      checkExistingAnalysis(isMounted).catch(console.error);
    }

    return () => {
      mounted = false;
    };
  }, [brand, checkExistingAnalysis]);

  if (!brand) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Brand not found</h2>
          <p className="mt-2 text-gray-600">The brand you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/brands">
            <Button className="mt-4">
              ← Back to Brands
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAnalyze = async () => {
    try {
      // Initialize progress
      setAnalysisProgress({
        currentStep: 'presence',
        completedSteps: []
      });
      await analyzeBrand(brand.name, setAnalysisProgress);
    } catch (error) {
      console.error('Failed to analyze brand:', error);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <Link href="/brands" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2">
            ← Back to Brands
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{brand.name}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {hasExistingAnalysis && !isAnalyzing(brand.name) && (
            <p className="text-sm text-gray-600">
              Previous analysis data found. Running analysis will update and merge with existing data.
            </p>
          )}
          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing(brand.name)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing(brand.name) ? 'Analyzing...' : 'Analyze Brand'}
          </Button>
        </div>
      </div>

      {isAnalyzing(brand.name) && (
        <div className="mb-8">
          <AnalysisProgress
            progress={analysisProgress}
            onCancel={cancelAnalysis}
          />
        </div>
      )}

      {isLoadingAnalysis ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BrandTab)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positioning">Positioning</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Website & Social Media</h3>
              {brand.info ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Website</label>
                    <p className="text-gray-900">{brand.info.website || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Social Media</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {Object.entries(brand.info.socials || {}).map(([platform, url]) => (
                        url && (
                          <div key={platform}>
                            <label className="text-sm font-medium text-gray-500 capitalize">{platform}</label>
                            <p className="text-gray-900 truncate">{url}</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No analysis data available</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              {brand.info ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Competitors</label>
                    <p className="text-2xl font-semibold text-gray-900">{brand.info.competitors?.length || 0}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Review Rating</label>
                    <p className="text-2xl font-semibold text-gray-900">
                      {brand.info.reviews?.averageRating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No analysis data available</p>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positioning" className="mt-6">
          {brand.info ? (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Brand Description</h3>
                  <p className="text-gray-700">{brand.info.positioning?.description || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Target Market</h3>
                  <p className="text-gray-700">{brand.info.positioning?.targetMarket || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Unique Selling Points</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {brand.info.positioning?.uniqueSellingPoints?.map((point, index) => (
                      <li key={index} className="text-gray-700">{point}</li>
                    )) || <li className="text-gray-500">No selling points available</li>}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Price Point</h3>
                  <p className="text-gray-700">{brand.info.positioning?.pricePoint || 'N/A'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No positioning data available</p>
              <Button onClick={handleAnalyze} className="mt-4">
                Analyze Brand
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          {brand.info?.competitors?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brand.info.competitors.map((competitor, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">{competitor.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Description</label>
                      <p className="text-gray-700">{competitor.description}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Strengths</label>
                      <ul className="list-disc list-inside mt-2">
                        {competitor.strengths?.map((strength, idx) => (
                          <li key={idx} className="text-gray-700">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Weaknesses</label>
                      <ul className="list-disc list-inside mt-2">
                        {competitor.weaknesses?.map((weakness, idx) => (
                          <li key={idx} className="text-gray-700">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No competitor data available</p>
              <Button onClick={handleAnalyze} className="mt-4">
                Analyze Brand
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          {brand.info?.reviews ? (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Overall Sentiment</h3>
                    <p className="text-gray-700">{brand.info.reviews.overallSentiment}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Average Rating</h3>
                    <p className="text-3xl font-bold text-gray-900">
                      {brand.info.reviews.averageRating?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Common Praises</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {brand.info.reviews.commonPraises?.map((praise, index) => (
                      <li key={index} className="text-gray-700">{praise}</li>
                    )) || <li className="text-gray-500">No praises available</li>}
                  </ul>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-4">Common Complaints</h3>
                  <ul className="list-disc list-inside space-y-2">
                    {brand.info.reviews.commonComplaints?.map((complaint, index) => (
                      <li key={index} className="text-gray-700">{complaint}</li>
                    )) || <li className="text-gray-500">No complaints available</li>}
                  </ul>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Review Sources</h3>
                <ul className="list-disc list-inside space-y-2">
                  {brand.info.reviews.sources?.map((source, index) => (
                    <li key={index} className="text-gray-700">{source}</li>
                  )) || <li className="text-gray-500">No sources available</li>}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No review data available</p>
              <Button onClick={handleAnalyze} className="mt-4">
                Analyze Brand
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Brand Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Brand ID</label>
                <p className="text-gray-900">{brand.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Slug</label>
                <p className="text-gray-900">{brand.slug}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-gray-900">{new Date(brand.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                <p className="text-gray-900">{new Date(brand.updatedAt).toLocaleString()}</p>
              </div>
              {brand.info && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Analysis</label>
                  <p className="text-gray-900">{new Date(brand.info.lastUpdated).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
     )}
   </div>
 );
}