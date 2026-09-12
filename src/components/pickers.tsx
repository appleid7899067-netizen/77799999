import { MODELS, LANGUAGE_GROUPS, type FleetModel } from "@/lib/catalog";
import { useFleet } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModelPicker({
  value,
  onChange,
  compact,
}: {
  value?: string;
  onChange?: (id: string) => void;
  compact?: boolean;
}) {
  const storeId = useFleet((s) => s.modelId);
  const setModel = useFleet((s) => s.setModel);
  const id = value ?? storeId;
  const set = onChange ?? setModel;
  const model = MODELS.find((m) => m.id === id) ?? MODELS[0];

  return (
    <Select value={id} onValueChange={set}>
      <SelectTrigger className={compact ? "h-8 w-[min(100%,16rem)] text-xs" : "w-[min(100%,22rem)]"}>
        <SelectValue>
          <span className="flex items-center gap-2 truncate">
            <span className="truncate">{model.name}</span>
            <span className="text-subtle">Free</span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {(["fast", "coding", "deep"] as FleetModel["tier"][]).map((tier) => {
          const group = MODELS.filter((m) => m.tier === tier);
          if (!group.length) return null;
          return (
            <SelectGroup key={tier}>
              <SelectLabel>{tier}</SelectLabel>
              {group.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  <span className="flex w-full items-center justify-between gap-3">
                    <span>
                      {m.name}
                      <span className="ml-2 text-subtle">{m.provider}</span>
                    </span>
                    <Badge variant="ok">Free</Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectGroup>
          );
        })}
      </SelectContent>
    </Select>
  );
}

export function LanguagePicker({
  value,
  onChange,
  label,
}: {
  value?: string;
  onChange?: (lang: string) => void;
  label?: string;
}) {
  const storeLang = useFleet((s) => s.language);
  const setLanguage = useFleet((s) => s.setLanguage);
  const lang = value ?? storeLang;
  const set = onChange ?? setLanguage;

  return (
    <div className="space-y-1.5">
      {label ? <p className="text-xs font-medium text-muted">{label}</p> : null}
      <Select value={lang} onValueChange={set}>
        <SelectTrigger>
          <SelectValue>{lang}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {LANGUAGE_GROUPS.map((g) => (
            <SelectGroup key={g.name}>
              <SelectLabel>{g.name}</SelectLabel>
              {g.items.map((item) => (
                <SelectItem key={item} value={item}>
                  {item}
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
