'use client'

import { useState, useEffect } from 'react'
import * as aq from 'arquero'
import { Button } from '@/components/ui/button'

export default function EditableClipboardTable() {
  const [rawText, setRawText] = useState('')
  const [table, setTable] = useState<aq.Table | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [editValue, setEditValue] = useState('')

  // 1. 클립보드에서 붙여넣기 감지
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData('text/plain')
      if (text) {
        setRawText(text)
        parseTextToTable(text) // 바로 파싱하여 테이블로 변환
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [])

  // 2. 텍스트 → 테이블 파싱
  const parseTextToTable = (text: string) => {
    const lines = text.trim().split('\n')
    const headers = lines[0].split('\t')
    const rows = lines.slice(1).map(line => {
      const values = line.split('\t')
      const row: Record<string, string> = {}
      headers.forEach((key, i) => (row[key] = values[i] ?? ''))
      return row
    })
    setTable(aq.from(rows))
  }

  // 3. 셀 자동 편집 상태 진입
  const handleEditStart = (rowIndex: number, col: string, value: any) => {
    setEditingCell({ row: rowIndex, col })
    setEditValue(value)
  }

  // 4. 편집 완료 시 적용
  const handleEditComplete = () => {
    if (!table || !editingCell) return
    const { row, col } = editingCell
    const rows = table.objects()
    rows[row][col] = editValue
    setTable(aq.from(rows))
    setEditingCell(null)
  }

  // 5. input 값 변경 시 즉시 반영
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value)
  }
  // 6. 백엔드 전송
  const sendToBackend = async () => {
    if (!table) return
    const data = table.objects()

    try {
      const response = await fetch('http://localhost:8000/process-table', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      })
      const result = await response.json()
      console.log('백엔드 응답:', result)
    } catch (err) {
      console.error('전송 실패:', err)
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">📋 클립보드 → 편집 가능한 테이블</h2>

      <span className="text-sm text-gray-500">엑셀에서 복사한 뒤 이 페이지에서 Ctrl+V 하세요</span>

      {table && (
        <>
        <div className="overflow-x-auto">
          <table className="border border-gray-300">
            <thead>
              <tr>
                {table.columnNames().map(col => (
                  <th key={col} className="border px-3 py-1 bg-gray-100 text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.objects().map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {table.columnNames().map(col => {
                    const isEditing = editingCell?.row === rowIndex && editingCell?.col === col
                    return (
                      <td key={col} className="border px-2 py-1 min-w-[120px]">
                        {isEditing ? (
                          <input
                            value={editValue}
                            onChange={handleInputChange}
                            onBlur={handleEditComplete}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditComplete()
                            }}
                            className="border px-1 w-full text-sm bg-transparent focus:bg-white"
                          />
                        ) : (
                          <span onClick={() => handleEditStart(rowIndex, col, row[col])}>
                            {row[col]}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button onClick={sendToBackend} className="mt-4">백엔드로 전송</Button>
        </>
      )}
    </div>
  )
}
