import React from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';
import Environment from '../Environment';
import setPosition from './setPosition';
import i18n from '../i18n';



/** We need to compare bounds by value, not by object ref **/
const bounds = elem => {
  const { top, left, width, height } = elem.getBoundingClientRect();
  return `${top}, ${left}, ${width}, ${height}`;
}

/**
 * The popup editor component.
 * 
 * TODO instead of just updating the current annotation state,
 * we could create a stack of revisions, and allow going back
 * with CTRL+Z.
 */
const Editor = props => {
  
  // The current state of the edited annotation vs. original
  const [ currentAnnotation, setCurrentAnnotation ] = useState();

  // Reference to the DOM element, so we can set position
  const element = useRef();

  // Re-render: set derived annotation state & position the editor
  useEffect(() => {
    // Shorthand: user wants a template applied and this is a selection
    const shouldApplyTemplate = props.applyTemplate && props.annotation?.isSelection;

    // Apply template if needed 
    const annotation = shouldApplyTemplate ? props.annotation.clone({ body: [ ...props.applyTemplate ]}) : props.annotation;

      

    // The 'currentAnnotation' differs from props.annotation because
    // the user has been editing. Moving the selection bounds will 
    // trigger this effect, but we don't want to update the currentAnnotation
    // on move. Therefore, don't update if a) props.annotation equals
    // the currentAnnotation, or props.annotation and currentAnnotations are
    // a selection, just created by the user. 
    const preventUpdate = currentAnnotation?.isEqual(annotation) ||
      (currentAnnotation?.isSelection && annotation?.isSelection);
    
    if (!preventUpdate)
      setCurrentAnnotation(annotation);


    if (shouldApplyTemplate && props.applyImmediately)
      props.onAnnotationCreated(annotation.toAnnotation());

    if (element.current) {
      // Note that ResizeObserver fires once when observation starts
      return initResizeObserver();
    }
  }, [ props.selectedElement, bounds(props.selectedElement) ]);

  const initResizeObserver = () => {
    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        setPosition(props.wrapperEl, element.current, props.selectedElement);
      });

      resizeObserver.observe(props.wrapperEl);
      return () => resizeObserver.disconnect();
    } else {
      // Fire setPosition *only* for devices that don't support ResizeObserver
      setPosition(props.wrapperEl, element.current, props.selectedElement);
    }  
  }

  // Creator and created/modified timestamp metadata
  const creationMeta = body => {
    const meta = {};

    const { user } = Environment;

    // Metadata is only added when a user is set, otherwise
    // the Editor operates in 'anonymous mode'. Also,
    // no point in adding meta while we're in draft state
    if (!body.draft && user) {
      meta.creator = {};
      if (user.id) meta.creator.id = user.id;
      if (user.displayName) meta.creator.name = user.displayName;

      if (body.created)
        body.modified = Environment.getCurrentTimeAdjusted();
      else
        body.created = Environment.getCurrentTimeAdjusted();
    }

    return meta;
  }

  const onAppendBody = body => setCurrentAnnotation(
    currentAnnotation.clone({ 
      body: [ ...currentAnnotation.bodies, { ...body, ...creationMeta(body) } ] 
    })
  );

  const onUpdateBody = (previous, updated) => {

    
    setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.map(body => 
        body === previous ? { ...updated, ...creationMeta(updated) } : body)
    })
  )};

  const onRemoveBody = body => setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.filter(b => b !== body)
    })
  );

  const onOk = _ => {
    // Removes the 'draft' flag from all bodies
    const undraft = annotation => annotation.clone({
      body : annotation.bodies.map(({ draft, ...rest }) =>
        draft ? { ...rest, ...creationMeta(rest) } : rest )
    });

       if (currentAnnotation.isSelection)
        props.onAnnotationCreated(undraft(currentAnnotation).toAnnotation());
      else
        props.onAnnotationUpdated(undraft(currentAnnotation), props.annotation);
    
  };
  const onDelete = () => {
   
        props.onAnnotationDeleted(props.annotation);
       
  };


  return (
    <div ref={element} className="r6o-editor">
      <div className="r6o-arrow" />
      <div className="r6o-editor-inner">
        { props.readOnly ? (
          <div className="r6o-footer">
            <button
              className="r6o-btn" 
              onClick={props.onCancel}>{i18n.t('Close')}</button>
          </div>
        ) : (

          <div className="r6o-footer">
              <button 
              className="r6o-btn outline"
              style="margin-right:15px;"
              onClick={onDelete}> <span>Cancel</span> 
              
              <svg height="14px" viewBox="0 0 365.71733 365" width="14px" style="margin-left:7px;" xmlns="http://www.w3.org/2000/svg"><g fill="#f44336"><path d="m356.339844 296.347656-286.613282-286.613281c-12.5-12.5-32.765624-12.5-45.246093 0l-15.105469 15.082031c-12.5 12.503906-12.5 32.769532 0 45.25l286.613281 286.613282c12.503907 12.5 32.769531 12.5 45.25 0l15.082031-15.082032c12.523438-12.480468 12.523438-32.75.019532-45.25zm0 0"/><path d="m295.988281 9.734375-286.613281 286.613281c-12.5 12.5-12.5 32.769532 0 45.25l15.082031 15.082032c12.503907 12.5 32.769531 12.5 45.25 0l286.632813-286.59375c12.503906-12.5 12.503906-32.765626 0-45.246094l-15.082032-15.082032c-12.5-12.523437-32.765624-12.523437-45.269531-.023437zm0 0"/></g></svg>

              
              {/* <img src="https://www.flaticon.com/svg/static/icons/svg/1828/1828665.svg" style="margin-left:5px; width:14px;height:14px;" alt=""/>   
               */}
                   </button>
            <button 
              className="r6o-btn "
              onClick={onOk}>
              <span>Convert</span> 
              <svg  xmlns="http://www.w3.org/2000/svg" 
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512; margin-left:5px;width:17px;height:17px;">
<path style="fill:#A5EB78;" d="M433.139,67.108L201.294,298.953c-6.249,6.249-16.381,6.249-22.63,0L78.861,199.15L0,278.011
	l150.547,150.549c10.458,10.458,24.642,16.333,39.431,16.333l0,0c14.788,0,28.973-5.876,39.43-16.333L512,145.968L433.139,67.108z"
	/>
<g style="opacity:0.1;">
	<path d="M485.921,119.888L187.59,418.22c-8.254,8.253-18.633,13.882-29.847,16.391c9.363,6.635,20.608,10.28,32.235,10.28l0,0
		c14.788,0,28.973-5.876,39.43-16.333L512,145.966L485.921,119.888z"/>
</g>

</svg>
              
              {/* <img src="https://www.flaticon.com/svg/static/icons/svg/390/390973.svg" style="margin-left:5px; width:17px;height:17px;" alt=""/>  */}
              </button>
          </div>
        )}
      </div>
    </div>
  )

}

export default Editor;