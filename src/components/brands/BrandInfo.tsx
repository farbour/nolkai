import { BrandInfo as BrandInfoType } from '@/types/brand';
import { formatDate } from '@/utils/dateFormatter';

interface BrandInfoProps {
  info: BrandInfoType;
}

export function BrandInfo({ info }: BrandInfoProps) {
  const rating = info.reviews?.averageRating;
  const formattedRating = typeof rating === 'number' ? rating.toFixed(1) : 'N/A';

  return (
    <div className="space-y-6">
      {/* Website & Social Media */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Website & Social Media</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Website</label>
            <p className="text-gray-900">{info.website || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Social Media</label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {Object.entries(info.socials || {}).map(([platform, url]) => (
                url && (
                  <div key={platform} className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-600 capitalize">
                        {platform.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <label className="text-sm font-medium text-gray-500 capitalize block">
                        {platform}
                      </label>
                      <a
                        href={url.startsWith('http') ? url : `https://${url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 truncate block"
                      >
                        {url.replace(/^https?:\/\//, '')}
                      </a>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Positioning */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Brand Positioning</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-gray-900">{info.positioning?.description || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Target Market</label>
            <p className="text-gray-900">{info.positioning?.targetMarket || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Unique Selling Points</label>
            <ul className="list-disc list-inside mt-2">
              {info.positioning?.uniqueSellingPoints?.map((point, index) => (
                <li key={index} className="text-gray-900">{point}</li>
              )) || <li className="text-gray-500">No selling points available</li>}
            </ul>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Price Point</label>
            <p className="text-gray-900">{info.positioning?.pricePoint || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Competitors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Competitors</h3>
        {info.competitors?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {info.competitors.map((competitor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{competitor.name}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{competitor.description}</p>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Strengths</label>
                    <ul className="list-disc list-inside mt-1">
                      {competitor.strengths?.map((strength, idx) => (
                        <li key={idx} className="text-sm text-gray-900">{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Weaknesses</label>
                    <ul className="list-disc list-inside mt-1">
                      {competitor.weaknesses?.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-gray-900">{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No competitor data available</p>
        )}
      </div>

      {/* Reviews */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Reviews & Sentiment</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Overall Sentiment</label>
            <p className="text-gray-900">{info.reviews?.overallSentiment || 'N/A'}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Average Rating</label>
            <p className="text-2xl font-semibold text-gray-900">
              {formattedRating}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Common Praises</label>
              <ul className="list-disc list-inside mt-2">
                {info.reviews?.commonPraises?.map((praise, index) => (
                  <li key={index} className="text-gray-900">{praise}</li>
                )) || <li className="text-gray-500">No praises available</li>}
              </ul>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Common Complaints</label>
              <ul className="list-disc list-inside mt-2">
                {info.reviews?.commonComplaints?.map((complaint, index) => (
                  <li key={index} className="text-gray-900">{complaint}</li>
                )) || <li className="text-gray-500">No complaints available</li>}
              </ul>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Review Sources</label>
            <ul className="list-disc list-inside mt-2">
              {info.reviews?.sources?.map((source, index) => (
                <li key={index} className="text-gray-900">{source}</li>
              )) || <li className="text-gray-500">No sources available</li>}
            </ul>
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        Last updated: {formatDate(info.lastUpdated)}
      </div>
    </div>
  );
}