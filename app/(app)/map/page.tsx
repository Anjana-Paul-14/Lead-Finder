import { ComponentWrapper } from "@/components/component-wrapper"
import { Map } from "@/components/map"

export default function SinkPage() {
  return (
    <div className="@container grid flex-1 gap-4 p-4">
      <ComponentWrapper name="map">
        <Map/>
      </ComponentWrapper>
    </div>
  )
}
