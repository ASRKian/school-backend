
/**
 * Returns the grade based on marks obtained and maximum marks.
 *
 * Grade scale:
 * - 90% and above: A+
 * - 80% to 89.99%: A
 * - 70% to 79.99%: B+
 * - 60% to 69.99%: B
 * - 50% to 59.99%: C
 * - 40% to 49.99%: D
 * - Below 40%: F
 *
 * @param {number} marks - Marks obtained.
 * @param {number} maxMarks - Maximum possible marks.
 * @returns {string} Grade as a string (A+, A, B+, B, C, D, F).
 * @throws {Error} If maxMarks is zero or negative.
 */
export function getGrade(marks, maxMarks) {
    if (maxMarks <= 0) {
        throw new Error("maxMarks must be greater than zero");
    }

    const percentage = (marks / maxMarks) * 100;

    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
}


/**
 * Calculates total percentage and pass/fail status.
 * @param {number[]} marksArr - Marks obtained in each subject.
 * @param {number[]} maxMarksArr - Maximum marks for each subject.
 * @param {number} passPercent - Minimum percentage required to pass (default: 33%).
 * @returns {{ percentage: number, status: string }}
 */
export function getResult(marksArr, maxMarksArr, passPercent = 33) {
    if (!Array.isArray(marksArr) || !Array.isArray(maxMarksArr) || marksArr.length !== maxMarksArr.length) {
        throw new Error("marksArr and maxMarksArr must be arrays of equal length");
    }

    const totalMarks = marksArr.reduce((sum, m) => sum + m, 0);
    const totalMaxMarks = maxMarksArr.reduce((sum, m) => sum + m, 0);

    const percentage = (totalMarks / totalMaxMarks) * 100;

    const status = percentage >= passPercent ? "PASS" : "FAIL";

    return {
        percentage: Number(percentage.toFixed(2)),
        status
    };
}

