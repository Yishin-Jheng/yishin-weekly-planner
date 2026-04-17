function getLocalToday(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Mon–Fri rows for the given month, with adjacent-month fill-ins to complete partial weeks.
// Each row always contains exactly 5 dates (Mon–Fri).
function getWeekRows(year: number, month: number): string[][] {
  const weeks: string[][] = [];
  let current: string[] = [];

  // Monday of the week containing the 1st of the month
  const firstOfMonth = new Date(year, month - 1, 1);
  const firstDow = firstOfMonth.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  const daysBackToMon = firstDow === 0 ? 6 : firstDow - 1;
  const start = new Date(year, month - 1, 1 - daysBackToMon);

  // Friday of the week containing the last day of the month
  const lastOfMonth = new Date(year, month, 0);
  const lastDow = lastOfMonth.getDay();
  const daysForwardToFri =
    lastDow === 0 ? -2 : lastDow === 6 ? -1 : 5 - lastDow;
  const end = new Date(lastOfMonth);
  end.setDate(end.getDate() + daysForwardToFri);

  const d = new Date(start);
  while (d <= end) {
    const dow = d.getDay();
    if (dow >= 1 && dow <= 5) {
      if (dow === 1 && current.length > 0) {
        weeks.push(current);
        current = [];
      }
      current.push(isoDate(d));
    }
    d.setDate(d.getDate() + 1);
  }
  if (current.length > 0) weeks.push(current);
  return weeks;
}

interface Props {
  year: number;
  month: number; // 1–12
  sprintDates: string[]; // ISO dates of the current sprint week (Mon–Fri)
  checkedDates: string[];
  onToggle: (date: string) => void;
}

export default function MiniCalendar({
  year,
  month,
  sprintDates,
  checkedDates,
  onToggle,
}: Props) {
  const today = getLocalToday();
  const checkedSet = new Set(checkedDates);
  const sprintSet = new Set(sprintDates);

  // Detect cross-month sprint for header label
  const lastSprintDate = sprintDates[sprintDates.length - 1];
  const endMonth = lastSprintDate
    ? parseInt(lastSprintDate.slice(5, 7), 10)
    : month;
  const endYear = lastSprintDate
    ? parseInt(lastSprintDate.slice(0, 4), 10)
    : year;
  const isCrossMonth = endMonth !== month || endYear !== year;

  const weekRows = getWeekRows(year, month);
  const headerText = isCrossMonth ? `${month}-${endMonth}月` : `${month}月`;

  return (
    <div className="mini-cal">
      <div className="mini-cal-header">{`【 ${headerText} 】`}</div>
      <div className="mini-cal-row mini-cal-row-labels">
        {["一", "二", "三", "四", "五"].map((l) => (
          <div key={l} className="mini-cal-cell mini-cal-cell-label">
            {l}
          </div>
        ))}
      </div>

      {weekRows.map((week, wi) => {
        const isSprintWeek = week.some((d) => sprintSet.has(d));

        return (
          <div key={wi} className="mini-cal-row">
            {week.map((date) => {
              const day = parseInt(date.slice(8), 10);
              const checked = checkedSet.has(date);
              const isToday = date === today;

              let cellClass = "mini-cal-cell";
              if (checked) cellClass += " mini-cal-cell-checked";
              else if (isSprintWeek) cellClass += " mini-cal-cell-sprint";
              else cellClass += " mini-cal-cell-other";
              if (isToday) cellClass += " mini-cal-cell-today";

              return (
                <button
                  key={date}
                  className={cellClass}
                  onClick={() => onToggle(date)}
                  title={date}
                >
                  {day}
                  {isToday && <span className="mini-cal-today-dot" />}
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
