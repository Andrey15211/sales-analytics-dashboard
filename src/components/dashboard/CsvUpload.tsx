import { useRef } from "react";
import { Upload } from "lucide-react";

type Props = {
  loading: boolean;
  onFile: (file: File) => void;
  actionLabel: string;
  loadingLabel: string;
};

export function CsvUpload({ loading, onFile, actionLabel, loadingLabel }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        hidden
        id="csv-upload"
        type="file"
        accept=".csv,text/csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
          event.target.value = "";
        }}
      />
      <button
        className="upload-button"
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        <Upload size={17} />
        {loading ? loadingLabel : actionLabel}
      </button>
    </>
  );
}
