import { SuggestedTagsProps } from "@/utils/interface";
import Button from "../common/Button";
const SuggestedTags = ({
  suggestedTags,
  suggestLoading,
  suggestError,
  onSelectTag,
}: SuggestedTagsProps) => (
  <div>
    <label className="block mb-1 font-medium">You might add</label>

    {suggestLoading && (
      <p className="text-sm text-gray-500">Loading suggestions…</p>
    )}
    {suggestError && <p className="text-sm text-red-500">{suggestError}</p>}
    {!suggestLoading && !suggestError && suggestedTags.length > 0 && (
      <div className="flex flex-wrap gap-2">
        {suggestedTags.map((tag) => (
          <Button
            key={tag}
            type="button"
            onClick={() => onSelectTag(tag)}
            className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded"
          >
            {tag}
          </Button>
        ))}
      </div>
    )}
    {!suggestLoading && !suggestError && suggestedTags.length === 0 && (
      <p className="text-sm text-gray-400">
        Type more content to see suggestions
      </p>
    )}
  </div>
);

export default SuggestedTags;
