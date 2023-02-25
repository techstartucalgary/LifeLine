import axios from "axios";
import { classnames } from "../../Utilities";
import { Button } from "../Button";
import jsonToICS, { Course, Courses } from "../../logic/icsGen";
import { useState, useRef } from "react";

interface NavigationDrawerProps {
  courses: Courses;
  currentCourse: Course | null;
  onCoursesChanged: (course: Course) => void;
  onCourseClick: (course: Course) => void;
}

const NavigationDrawer = ({
  courses,
  currentCourse,
  onCoursesChanged,
  onCourseClick,
}: NavigationDrawerProps) => {
  const [loading, setLoading] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOutlineUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    setLoading(Array.from(files).map((f: File) => f.name));

    while (files.length > 0) {
      const file = files.pop();

      const formData = new FormData();
      formData.append("outline_file", file as File);

      await axios
        .post("/files", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          // convert to Course. Everything is the same but the assessments.date need to be converted to Date and the assessments.weight need to be converted to number
          const course: Course = {
            ...res.data,
            assessments: res.data.assessments.map((a: any) => ({
              ...a,
              date: new Date(a.date),
              weight: Number(a.weight),
            })),
          };
          onCoursesChanged(course);
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading((prev) => prev.filter((f) => f !== file?.name));
        });
    }
  };

  const handleExport = () => {
    const a = document.createElement("a");
    a.href = `data:text/plain;charset=utf-8,${encodeURIComponent(
      jsonToICS(courses)
    )}`;
    a.download = "deadlines.ics";
    a.click();
  };

  return (
    <div className="flex flex-col w-full md:p-4 p-0 bg-surface">
      <p className="m-5 ml-2 font-bold">Courses</p>
      {courses &&
        courses.map((course, t) => (
          <Button
            variant="text"
            onClick={() => onCourseClick(course)}
            key={t}
            className={classnames(
              "text-gray-900",
              "mt-2",
              "flex",
              "flex-row",
              "p-4",
              currentCourse?.key === course.key && "bg-primary-90"
            )}
          >
            <div className="flex items-center justify-center">
              <span className="material-symbols-outlined text-gray-600 text-base">
                {
                  ["circle", "square", "pentagon"][
                    Math.abs(
                      course.key
                        .split("")
                        .reduce((a, b) => a + b.charCodeAt(0), 0)
                    ) % 3
                  ]
                }
              </span>
            </div>
            <div className="flex flex-col ml-2 min-w-0">
              <p className="flex items-center font-bold">
                {course.code} {course.number}
              </p>
              <p className={classnames("truncate", "md:hidden")}>
                {course.topic}
              </p>
            </div>
            <p className="ml-auto flex items-center justify-center">
              {course.assessments.length}
            </p>
            <div className="flex items-center justify-center md:hidden">
              <span className="material-symbols-outlined text-gray-600">
                arrow_right
              </span>
            </div>
          </Button>
        ))}
      {loading.length > 0 && (
        <div className="flex flex-col w-full">
          {loading.map((file) => (
            <Button
              variant="text"
              key={file}
              disabled
              className={classnames("mt-2", "flex-row", "p-4")}
            >
              <div>
                <span className="material-symbols-outlined text-gray-600 text-base animate-spin">
                  autorenew
                </span>
              </div>
              <div className="flex flex-col ml-2 min-w-0">
                <p className={classnames("truncate")}>{file}</p>
              </div>
            </Button>
          ))}
        </div>
      )}
      <Button
        variant="text"
        onClick={() => {
          inputRef.current?.click();
        }}
        className="text-gray-900 mt-2 p-4"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          multiple
          onChange={handleOutlineUpload}
          className="hidden"
        />
        <span
          className="material-symbols-outlined text-gray-600 flex items-center justify-center"
          style={{ marginLeft: "-0.4rem" }}
        >
          add
        </span>
        <p
          className="flex items-center ml-2"
          style={{ transform: "translateX(-0.4rem)" }}
        >
          Add course
        </p>
      </Button>
      <hr className="border-gray-300 p-2 hidden md:block" />
      <Button
        variant="filled"
        className={classnames(
          "fixed",
          "bottom-0",
          "right-0",
          "md:relative",
          "p-4",
          "m-5",
          "mb-10",
          "md:m-0",
          "shadow-lg",
          "md:shadow-none",
          "rounded-2xl",
          "md:rounded-3xl"
        )}
        onClick={handleExport}
        disabled={courses.length === 0 || loading.length > 0}
      >
        <span
          className="material-symbols-outlined flex items-center justify-center"
          style={{ marginLeft: "-0.4rem" }}
        >
          save_alt
        </span>
        <p className="flex items-center ml-2">Export</p>
      </Button>
    </div>
  );
};

export default NavigationDrawer;
export type { NavigationDrawerProps };
