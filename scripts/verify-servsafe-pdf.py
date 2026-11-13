"""Check the hosted 2027 form: python scripts/verify-servsafe-pdf.py <pdf>."""
import sys
import unittest
from pypdf import PdfReader

reader = PdfReader(sys.argv.pop())

class ServSafePDFTests(unittest.TestCase):
    def test_original_class_dates_are_preserved(self):
        labels = set(reader.get_fields())
        for date in ["January 13–14", "February 24–25", "March 17–18", "April 14–15", "May 19–20", "June 23–24", "July 14–15", "August 18–19", "September 15–16", "October 20–21", "November 17–18"]:
            self.assertIn(f"{date}, 2027", labels)

    def test_original_fee_options_are_preserved(self):
        labels = set(reader.get_fields())
        for option in ["Class: Includes Book & Exam — $190", "Class & Exam Only: No Book — $135", "Book & Exam Only: No Class — $135", "Book Only — $75", "Exam Only: Day 2 at 1:00 PM — $75", "Online Exam (Call for appt.) — $75"]:
            self.assertIn(option, labels)

    def test_document_is_one_page_and_has_labeled_fields(self):
        self.assertEqual(len(reader.pages), 1)
        self.assertIn("/StructTreeRoot", reader.trailer["/Root"])
        self.assertEqual(len(reader.get_fields()), 31)
        self.assertTrue(all(field.get("/TU") for field in reader.get_fields().values()))

if __name__ == "__main__":
    unittest.main()