import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// file path: src/components/brands/dialog/BrandInfoView.tsx
import { BrandInfo } from '@/types/brand';
import { formatDate } from '@/utils/dateFormatter';

interface BrandInfoViewProps {
  info: BrandInfo;
}

export function BrandInfoView({ info }: BrandInfoViewProps) {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="positioning">Positioning</TabsTrigger>
          <TabsTrigger value="competitors">Competitors</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Online Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <a
                    href={info.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 block text-blue-600 hover:text-blue-800"
                  >
                    {info.website}
                  </a>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">Social Media</label>
                  <div className="mt-2 space-y-2">
                    {Object.entries(info.socials).map(([platform, url]) => (
                      url && (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                        >
                          <span className="capitalize">{platform}</span>
                        </a>
                      )
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="positioning" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Market Positioning</h3>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">Description</label>
                  <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                    {info.positioning.description}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">Target Market</label>
                  <p className="mt-1 text-gray-900">
                    {info.positioning.targetMarket}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">
                    Unique Selling Points
                  </label>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {info.positioning.uniqueSellingPoints.map((point, index) => (
                      <li key={index} className="text-gray-900">{point}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-white rounded-lg border">
                  <label className="text-sm font-medium text-gray-500">Price Point</label>
                  <p className="mt-1 text-gray-900">
                    {info.positioning.pricePoint}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="competitors" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Competitors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {info.competitors.map((competitor, index) => (
                <div key={index} className="p-4 bg-white rounded-lg border">
                  <h4 className="font-medium text-gray-900">{competitor.name}</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {competitor.description}
                  </p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Strengths</label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {competitor.strengths.map((strength, idx) => (
                          <li key={idx} className="text-sm text-gray-900">{strength}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Weaknesses</label>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        {competitor.weaknesses.map((weakness, idx) => (
                          <li key={idx} className="text-sm text-gray-900">{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Reviews & Sentiment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <label className="text-sm font-medium text-gray-500">
                  Overall Sentiment
                </label>
                <p className="mt-1 text-gray-900">{info.reviews.overallSentiment}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <label className="text-sm font-medium text-gray-500">
                  Average Rating
                </label>
                <div className="mt-1 flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {info.reviews.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">out of 5</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg border">
                <label className="text-sm font-medium text-gray-500">
                  Common Praises
                </label>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {info.reviews.commonPraises.map((praise, index) => (
                    <li key={index} className="text-gray-900">{praise}</li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <label className="text-sm font-medium text-gray-500">
                  Common Complaints
                </label>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {info.reviews.commonComplaints.map((complaint, index) => (
                    <li key={index} className="text-gray-900">{complaint}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <label className="text-sm font-medium text-gray-500">Sources</label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {info.reviews.sources.map((source, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-600"
                  >
                    {source}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-xs text-gray-500 mt-4">
        Last updated: {formatDate(info.lastUpdated)}
      </div>
    </div>
  );
}