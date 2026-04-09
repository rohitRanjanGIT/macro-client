$ARGUMENTS

# Clean Frontend Design
 
This skill produces frontend pages split into multiple focused components — one component per concern. Code should be immediately readable and editable by any developer.
 
## Core Philosophy
 
- **Split everything**: No monolithic files. Every logical section of a page gets its own component.
- **index.jsx just assembles**: The top-level file imports and stacks components — nothing more.
- **Use libraries, not custom UI**: Never write buttons, inputs, cards, graphs, or modals from scratch. Use existing libraries.
- **Readable over clever**: Clear names, flat structure, no over-abstraction.
 
---
 
## Folder Structure
 
Always organize output like this:
 
```
screens/
  <ScreenName>/
    index.jsx          ← assembles the page, imports everything
    <Section1>.jsx     ← one logical section per file
    <Section2>.jsx
    <Section3>.jsx
    ...
 
components/
  <SharedComponent>.jsx   ← reusable across screens
  <AnotherShared>.jsx
```
 
**Rules:**
- `index.jsx` contains ONLY imports and a layout wrapper — no logic, no inline JSX beyond stacking components
- Each section component handles its own data display and local state
- Shared components (used in 2+ screens) go in `components/`
- Name files after what they show, not what they do (e.g. `CalorieGraph.jsx` not `GraphComponent.jsx`)
 
---
 
## UI Libraries — Use These, Don't Reinvent
 
Always prefer pre-existing libraries. Never write custom UI primitives.
 
### Component Libraries (pick one per project)
- **shadcn/ui** — for React; clean, accessible, composable. Preferred default.
  - `import { Card, CardContent, CardHeader } from "@/components/ui/card"`
  - `import { Button } from "@/components/ui/button"`
  - `import { Badge } from "@/components/ui/badge"`
- **Radix UI** — headless primitives if full control over styling is needed
- **Chakra UI** — if the user prefers it
 
### Charts & Graphs
- **Recharts** — for React. Use for all data visualizations.
  - `import { LineChart, BarChart, PieChart, ... } from "recharts"`
- **Chart.js** — if working outside React
 
### Icons
- **lucide-react** — preferred
  - `import { Flame, Target, TrendingUp } from "lucide-react"`
- **heroicons** — alternative
 
### Utilities
- **clsx** or **cn()** — for conditional class names
- **date-fns** — for date formatting
- **lodash** — for data manipulation
 
---
 
## Component Rules
 
### index.jsx — assembler only
```jsx
import StreakRow from "./StreakRow"
import CalorieGraph from "./CalorieGraph"
import SummaryStats from "./SummaryStats"
 
export default function ProgressScreen() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <StreakRow />
      <SummaryStats />
      <CalorieGraph />
    </div>
  )
}
```
 
### Section components — one job each
```jsx
// CalorieGraph.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
 
export default function CalorieGraph({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Calories This Week</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart width={300} height={200} data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#f97316" />
        </BarChart>
      </CardContent>
    </Card>
  )
}
```
 
---
 
## What to Deliver
 
When asked to build a page or screen:
 
1. **List the components** you'll create before writing any code — confirm the breakdown makes sense
2. **Write each file separately**, clearly labeled
3. **Start with `index.jsx`** so the overall structure is clear upfront
4. **Then write each section component** in order of appearance on the page
5. **Note any shared components** that belong in `components/`
 
---
 
## Naming Conventions
 
| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `StreakRow.jsx` |
| Screen folders | PascalCase | `screens/Progress/` |
| Props | camelCase | `calorieData`, `isLoading` |
| CSS classes | Tailwind utilities | `className="flex gap-4"` |
| Event handlers | `handle` prefix | `handleToggle`, `handleSelect` |
 
---
 
## What NOT to do
 
- ❌ Write a single 300-line component file
- ❌ Build custom buttons, inputs, modals, or charts from scratch
- ❌ Put business logic inside `index.jsx`
- ❌ Name components generically (`Component1.jsx`, `Section.jsx`)
- ❌ Use inline styles for anything beyond trivial one-offs
