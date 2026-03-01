import { render, screen, fireEvent } from '@testing-library/react'
import { EditorToolbar } from '../EditorToolbar'

const createMockEditor = () => {
    const mockRun = jest.fn();
    const mockCommands = {
        setParagraph: jest.fn().mockReturnValue({ run: mockRun }),
        toggleHeading: jest.fn().mockReturnValue({ run: mockRun }),
        toggleBold: jest.fn().mockReturnValue({ run: mockRun }),
        toggleItalic: jest.fn().mockReturnValue({ run: mockRun }),
        toggleUnderline: jest.fn().mockReturnValue({ run: mockRun }),
        toggleBulletList: jest.fn().mockReturnValue({ run: mockRun }),
        toggleOrderedList: jest.fn().mockReturnValue({ run: mockRun }),
        toggleTaskList: jest.fn().mockReturnValue({ run: mockRun }),
        setImage: jest.fn().mockReturnValue({ run: mockRun }),
        setLink: jest.fn().mockReturnValue({ run: mockRun }),
    };

    return {
        isActive: jest.fn().mockReturnValue(false),
        chain: jest.fn().mockReturnValue({
            focus: jest.fn().mockReturnValue(mockCommands)
        }),
        _mockRun: mockRun,
        _mockCommands: mockCommands,
    } as any;
};

describe('EditorToolbar Component', () => {
    it('renders all formatting buttons', () => {
        render(<EditorToolbar editor={createMockEditor()} />)

        expect(screen.getByTitle('Bold')).toBeInTheDocument()
        expect(screen.getByTitle('Italic')).toBeInTheDocument()
        expect(screen.getByTitle('Underline')).toBeInTheDocument()
        expect(screen.getByTitle('Bullet List')).toBeInTheDocument()
        expect(screen.getByTitle('Numbered List')).toBeInTheDocument()
        expect(screen.getByTitle('Checklist')).toBeInTheDocument()
        expect(screen.getByTitle('Insert Image')).toBeInTheDocument()
        expect(screen.getByTitle('Insert Link')).toBeInTheDocument()
    })

    it('renders the heading dropdown', () => {
        render(<EditorToolbar editor={createMockEditor()} />)
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        expect(screen.getByText('Normal Text')).toBeInTheDocument()
    })

    it('handles button clicks', () => {
        const editor = createMockEditor()
        render(<EditorToolbar editor={editor} />)

        fireEvent.click(screen.getByTitle('Bold'))
        expect(editor._mockCommands.toggleBold).toHaveBeenCalled()
        expect(editor._mockRun).toHaveBeenCalled()
    })
})
